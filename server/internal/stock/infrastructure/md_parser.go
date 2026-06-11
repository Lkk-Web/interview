package infrastructure

import (
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/Lkk-Web/interview/server/internal/stock/domain"
)

var entryRe = regexp.MustCompile(`^### (\d{4}-\d{2}-\d{2})\s*([！？]?)`)
var monthlyTRe = regexp.MustCompile(`(\d+)\s*月.*?T\s*累计[：:]\s*([\d.]+)\s*元`)

// ParseStockMD 解析 stock.md，提取每个日条目为 DailyLog。
func ParseStockMD(path string) ([]domain.DailyLog, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	lines := strings.Split(string(data), "\n")

	var starts []int
	for i, l := range lines {
		if entryRe.MatchString(l) {
			starts = append(starts, i)
		}
	}

	var logs []domain.DailyLog
	for k, s := range starts {
		end := len(lines)
		if k+1 < len(starts) {
			end = starts[k+1]
		}
		if log := parseEntry(lines[s:end]); log != nil {
			logs = append(logs, *log)
		}
	}
	return logs, nil
}

func parseEntry(lines []string) *domain.DailyLog {
	m := entryRe.FindStringSubmatch(lines[0])
	if m == nil {
		return nil
	}
	log := &domain.DailyLog{Date: m[1], Marker: strings.TrimSpace(m[2])}

	sections := map[string][]string{}
	cur := ""
	sectionMap := map[string]string{
		"**持仓情况**": "pos", "**今日操作**": "trades",
		"**今日做T收益**": "tr", "**今日做 T 收益**": "tr", "**今日复盘**": "review",
	}
	for _, line := range lines[1:] {
		t := strings.TrimSpace(line)
		if name, ok := sectionMap[t]; ok {
			cur = name
		} else if cur != "" {
			sections[cur] = append(sections[cur], line)
		}
	}

	log.Positions = parsePositionSection(sections["pos"])
	log.Trades = parseTradeSection(sections["trades"])
	log.TRecords, log.MonthlyTRevenue = parseTRecordSection(sections["tr"])
	if log.MonthlyTRevenue == 0 {
		log.MonthlyTRevenue = extractMonthlyT(sections["review"])
	}
	log.Review = parseReviewSection(sections["review"])
	return log
}

func splitRow(line string) []string {
	line = strings.TrimSpace(line)
	if !strings.HasPrefix(line, "|") {
		return nil
	}
	parts := strings.Split(line, "|")
	var cells []string
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			cells = append(cells, p)
		}
	}
	return cells
}

func isSep(cells []string) bool {
	for _, c := range cells {
		for _, ch := range strings.TrimSpace(c) {
			if ch != '-' && ch != ':' && ch != ' ' {
				return false
			}
		}
	}
	return len(cells) > 0
}

func parsePositionSection(lines []string) []domain.PositionSnapshot {
	var header []string
	var result []domain.PositionSnapshot
	for _, line := range lines {
		cells := splitRow(line)
		if cells == nil {
			continue
		}
		if isSep(cells) {
			continue
		}
		if header == nil {
			header = cells
			continue
		}
		pos := domain.PositionSnapshot{}
		for i, h := range header {
			if i >= len(cells) {
				break
			}
			switch h {
			case "股票":
				pos.Stock = cells[i]
			case "代码":
				pos.Code = cells[i]
			case "成本价":
				pos.Cost = parseF(cells[i])
			case "持仓数量":
				pos.Shares = parseF(cells[i])
			}
		}
		if pos.Stock != "" && pos.Shares > 0 {
			result = append(result, pos)
		}
	}
	return result
}

func parseTradeSection(lines []string) []domain.Trade {
	var result []domain.Trade
	headerSeen := false
	for _, line := range lines {
		t := strings.TrimSpace(line)
		if t == "无" {
			return nil
		}
		cells := splitRow(line)
		if cells == nil || isSep(cells) {
			continue
		}
		if !headerSeen {
			headerSeen = true
			continue
		}
		if len(cells) < 5 {
			continue
		}
		action := cells[0]
		if action != "买入" && action != "卖出" {
			continue
		}
		result = append(result, domain.Trade{
			Action: action,
			Stock:  cells[1],
			Code:   cells[2],
			Price:  parseF(cells[3]),
			Shares: parseF(cells[4]),
		})
	}
	return result
}

func parseTRecordSection(lines []string) ([]domain.TRecord, float64) {
	var result []domain.TRecord
	var monthlyT float64
	headerSeen := false
	for _, line := range lines {
		t := strings.TrimSpace(line)
		if t == "无" {
			return nil, 0
		}
		if m := monthlyTRe.FindStringSubmatch(t); m != nil {
			monthlyT = parseF(m[2])
		}
		cells := splitRow(line)
		if cells == nil || isSep(cells) {
			continue
		}
		if !headerSeen {
			headerSeen = true
			continue
		}
		if len(cells) < 6 {
			continue
		}
		stock := cleanCell(cells[0])
		if stock == "" || strings.Contains(stock, "合计") {
			continue
		}
		result = append(result, domain.TRecord{
			Stock:       stock,
			Desc:        cleanCell(cells[1]),
			GrossProfit: parseAmt(cells[2]),
			Fee:         parseAmt(cells[3]),
			Tax:         parseAmt(cells[4]),
			NetRevenue:  parseAmt(cells[5]),
		})
	}
	return result, monthlyT
}

func parseReviewSection(lines []string) domain.DailyReview {
	var r domain.DailyReview
	var nextPlan []string
	inNext := false
	for _, line := range lines {
		t := strings.TrimSpace(line)
		if t == "" {
			continue
		}
		if v, ok := stripPrefix(t, "- 市场情绪：", "- 市场情绪:"); ok {
			r.Market = v
			inNext = false
		} else if v, ok := stripPrefix(t, "- 操作感受：", "- 操作感受:"); ok {
			r.Feeling = v
			inNext = false
		} else if strings.HasPrefix(t, "- 明日计划") {
			inNext = true
		} else if inNext && (strings.HasPrefix(t, "  - ") || strings.HasPrefix(t, "- ")) {
			nextPlan = append(nextPlan, strings.TrimLeft(t, " -"))
		} else {
			inNext = false
		}
	}
	r.NextPlan = strings.Join(nextPlan, "\n")
	return r
}

func extractMonthlyT(lines []string) float64 {
	for _, line := range lines {
		if m := monthlyTRe.FindStringSubmatch(line); m != nil {
			return parseF(m[2])
		}
	}
	return 0
}

func stripPrefix(s string, prefixes ...string) (string, bool) {
	for _, p := range prefixes {
		if strings.HasPrefix(s, p) {
			return strings.TrimSpace(strings.TrimPrefix(s, p)), true
		}
	}
	return "", false
}

func cleanCell(s string) string {
	s = strings.ReplaceAll(s, "**", "")
	return strings.TrimSpace(s)
}

func parseAmt(s string) float64 {
	s = cleanCell(s)
	s = strings.ReplaceAll(s, "元", "")
	s = strings.TrimLeft(s, "+")
	f, _ := strconv.ParseFloat(strings.TrimSpace(s), 64)
	return f
}

func parseF(s string) float64 {
	s = strings.TrimSpace(s)
	for _, suf := range []string{"元", "%", "股", "-"} {
		s = strings.TrimSuffix(s, suf)
	}
	s = strings.ReplaceAll(s, ",", "")
	f, _ := strconv.ParseFloat(strings.TrimSpace(s), 64)
	return f
}
