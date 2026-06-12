package infrastructure

import (
	"fmt"
	"log"
	"os/exec"
	"strings"
	"sync"
)

// GitCommitter 在文件同步完成后自动 git add + commit + push。
// 和 JSONExporter / MarkdownWriter 同层，属于"尽力而为"的基础设施：
// git 操作失败只打日志，不影响 API 响应。
type GitCommitter struct {
	repoDir string
	enabled bool
	mu      sync.Mutex // 防止并发 commit 冲突
}

func NewGitCommitter(repoDir string, enabled bool) *GitCommitter {
	return &GitCommitter{repoDir: repoDir, enabled: enabled}
}

// CommitAndPush 将指定文件 commit 并 push 到远程。
// 使用 git commit <files> -m "..." 只提交指定文件，不会带走暂存区里的其他改动。
// date 用于生成 commit message 里的日期部分（如 "6.12"）。
// recordType 区分提交类型："stock" 或 "asset"。
func (g *GitCommitter) CommitAndPush(date string, recordType string, files []string) {
	if !g.enabled || len(files) == 0 {
		return
	}

	// 异步执行，不阻塞 API 响应
	go func() {
		g.mu.Lock()
		defer g.mu.Unlock()

		shortDate := formatShortDate(date)
		msg := fmt.Sprintf("✨ feat: updata %s %s record", shortDate, recordType)

		// git commit <files> -m "msg" 只提交这几个文件，不影响本地其他修改
		if err := g.gitCommitFiles(msg, files); err != nil {
			log.Printf("[GitCommitter] git commit failed: %v", err)
			return
		}
		if err := g.gitPush(); err != nil {
			log.Printf("[GitCommitter] git push failed: %v", err)
			return
		}
		log.Printf("[GitCommitter] committed and pushed: %s", msg)
	}()
}

// gitCommitFiles 用 git commit <files> -m "msg"，只提交指定文件，
// 不管暂存区有什么都不会误带。
func (g *GitCommitter) gitCommitFiles(message string, files []string) error {
	args := append([]string{"commit"}, files...)
	args = append(args, "-m", message)
	return g.run("git", args...)
}

func (g *GitCommitter) gitPush() error {
	return g.run("git", "push")
}

func (g *GitCommitter) run(name string, args ...string) error {
	cmd := exec.Command(name, args...)
	cmd.Dir = g.repoDir
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("%s %s: %w\n%s", name, strings.Join(args, " "), err, string(output))
	}
	return nil
}

// formatShortDate 把 "2026-06-12" 转换为 "6.12" 格式。
func formatShortDate(date string) string {
	parts := strings.Split(date, "-")
	if len(parts) != 3 {
		return date
	}
	month := strings.TrimLeft(parts[1], "0")
	day := strings.TrimLeft(parts[2], "0")
	return month + "." + day
}
