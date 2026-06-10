package infrastructure

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/Lkk-Web/interview/server/internal/stock/domain"
)

var (
	ErrDateExists    = errors.New("daily log for this date already exists")
	ErrMonthNotFound = errors.New("month section not found")
)

// MarkdownWriter 负责把每日记录追加写入 stock.md，保持和手写格式完全一致。
type MarkdownWriter struct {
	stockMDPath string
}

func NewMarkdownWriter(stockMDPath string) *MarkdownWriter {
	return &MarkdownWriter{stockMDPath: stockMDPath}
}

// AppendDailyLog 找到正确位置后把新日条目插入 stock.md。
func (w *MarkdownWriter) AppendDailyLog(log domain.DailyLog) error {
	data, err := os.ReadFile(w.stockMDPath)
	if err != nil {
		return fmt.Errorf("read stock.md: %w", err)
	}

	lines := strings.Split(string(data), "\n")
	// 去掉末尾多余的空行，统一由插入逻辑控制换行
	for len(lines) > 0 && strings.TrimSpace(lines[len(lines)-1]) == "" {
		lines = lines[:len(lines)-1]
	}

	insertAfter, newSection, err := findInsertPosition(lines, log.Date)
	if err != nil {
		return err
	}

	block := buildMarkdownBlock(log)
	lines = splice(lines, insertAfter, newSection, log.Date, block)

	return os.WriteFile(w.stockMDPath, []byte(strings.Join(lines, "\n")+"\n"), 0644)
}

// findInsertPosition 返回新条目应插入在哪一行之后（0-based）。
// newSection=true 表示需要先追加月份 section 标题。
func findInsertPosition(lines []string, date string) (insertAfter int, newSection bool, err error) {
	monthNum, err := parseMonthNum(date) // "2026-06-10" → 6
	if err != nil {
		return 0, false, err
	}
	sectionPrefix := fmt.Sprintf("## %d月操作计划", monthNum)
	dateHeading := "### " + date

	sectionStart := -1
	for i, line := range lines {
		trimmed := strings.TrimSpace(line)
		if strings.HasPrefix(trimmed, dateHeading) {
			return 0, false, fmt.Errorf("%w: %s", ErrDateExists, date)
		}
		if strings.HasPrefix(trimmed, sectionPrefix) {
			sectionStart = i
		}
		// 找到月份 section 后，遇到下一个 ## 说明当前月份 section 已结束
		if sectionStart >= 0 && i > sectionStart && strings.HasPrefix(trimmed, "## ") {
			// 插入在下一个 ## 之前的最后一个非空行后面
			j := i - 1
			for j > sectionStart && strings.TrimSpace(lines[j]) == "" {
				j--
			}
			return j, false, nil
		}
	}

	if sectionStart >= 0 {
		// 本月 section 是文件最后一个，追加到末尾
		return len(lines) - 1, false, nil
	}

	// 本月 section 不存在，需要新建
	return len(lines) - 1, true, nil
}

// splice 把新内容插入 lines[insertAfter] 之后。
func splice(lines []string, insertAfter int, newSection bool, date string, block string) []string {
	var toInsert []string
	if newSection {
		monthNum, _ := parseMonthNum(date)
		toInsert = append(toInsert, "", "---", "", fmt.Sprintf("## %d月操作计划", monthNum), "")
	}
	toInsert = append(toInsert, "", block)

	result := make([]string, 0, len(lines)+len(toInsert))
	result = append(result, lines[:insertAfter+1]...)
	result = append(result, toInsert...)
	result = append(result, lines[insertAfter+1:]...)
	return result
}

func parseMonthNum(date string) (int, error) {
	if len(date) < 7 {
		return 0, fmt.Errorf("invalid date format: %s", date)
	}
	return strconv.Atoi(date[5:7])
}

// buildMarkdownBlock 按照 stock.md 现有格式渲染一个日条目。
func buildMarkdownBlock(log domain.DailyLog) string {
	var b strings.Builder

	// 标题
	title := "### " + log.Date
	if log.Marker != "" {
		title += " " + log.Marker
	}
	b.WriteString(title + "\n")

	// 持仓情况
	b.WriteString("\n**持仓情况**\n\n")
	if len(log.PositionUpdates) > 0 {
		b.WriteString("| 股票 | 代码 | 成本价 | 持仓数量 |\n")
		b.WriteString("| ---- | ---- | ------ | -------- |\n")
		for _, p := range log.PositionUpdates {
			code := stripMarketPrefix(p.Code)
			b.WriteString(fmt.Sprintf("| %s | %s | %g | %g |\n", stockNameByCode(log, p.Code), code, p.Cost, p.Shares))
		}
	} else {
		b.WriteString("无\n")
	}

	// 今日操作
	b.WriteString("\n**今日操作**\n\n")
	if len(log.Trades) > 0 {
		b.WriteString("| 操作 | 股票 | 代码 | 价格 | 数量 |\n")
		b.WriteString("| ---- | ---- | ---- | ---- | ---- |\n")
		for _, t := range log.Trades {
			code := stripMarketPrefix(t.Code)
			b.WriteString(fmt.Sprintf("| %s | %s | %s | %g | %g |\n",
				t.Action, t.Stock, code, t.Price, t.Shares))
		}
	} else {
		b.WriteString("无\n")
	}

	// 今日做T收益
	b.WriteString("\n**今日做T收益**\n\n")
	if len(log.TRecords) > 0 {
		b.WriteString("| 股票 | 操作 | 毛利 | 手续费 | 印花税 | 净收益 |\n")
		b.WriteString("| ---- | ---- | ---- | ------ | ------ | ------ |\n")
		totalNet := 0.0
		for _, r := range log.TRecords {
			b.WriteString(fmt.Sprintf("| %s | %s | %.2f元 | %.2f元 | %.2f元 | %.2f元 |\n",
				r.Stock, r.Desc, r.GrossProfit, r.Fee, r.Tax, r.NetRevenue))
			totalNet += r.NetRevenue
		}
		b.WriteString(fmt.Sprintf("| **合计** | | | | | **%.2f元** |\n", totalNet))
	} else {
		b.WriteString("无\n")
	}

	// 今日复盘
	b.WriteString("\n**今日复盘**\n\n")
	if log.Review.Market != "" {
		b.WriteString("- 市场情绪：" + log.Review.Market + "\n")
	}
	if log.Review.Feeling != "" {
		b.WriteString("- 操作感受：" + log.Review.Feeling + "\n")
	}
	if log.Review.NextPlan != "" {
		b.WriteString("- 明日计划：\n")
		for _, line := range strings.Split(log.Review.NextPlan, "\n") {
			if strings.TrimSpace(line) != "" {
				b.WriteString("  - " + strings.TrimSpace(line) + "\n")
			}
		}
	}

	// 月度T累计
	if log.MonthlyTRevenue != 0 {
		monthNum, _ := parseMonthNum(log.Date)
		b.WriteString(fmt.Sprintf("\n- **%d月T累计：%.2f元**", monthNum, log.MonthlyTRevenue))
	}

	return b.String()
}

// stripMarketPrefix 把 "sz000516" → "000516"，没有前缀的直接返回。
func stripMarketPrefix(code string) string {
	if len(code) > 2 && (strings.HasPrefix(code, "sz") || strings.HasPrefix(code, "sh")) {
		return code[2:]
	}
	return code
}

// stockNameByCode 在 PositionUpdates 里找股票名称；找不到返回 code。
// 这里 PositionUpdates 只有 code，名称由前端传的 Trades 里带。
func stockNameByCode(log domain.DailyLog, code string) string {
	for _, t := range log.Trades {
		if t.Code == code {
			return t.Stock
		}
	}
	return stripMarketPrefix(code)
}
