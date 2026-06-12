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
// 使用 git commit --only 从工作区直接提交，不经过 index，
// commit 后再 restore --staged 清掉隐式暂存，不影响用户自己的暂存区。
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

		// --only 让 git 从工作区取文件内容提交，不碰用户的暂存区
		if err := g.gitCommitOnly(msg, files); err != nil {
			log.Printf("[GitCommitter] git commit failed: %v", err)
			return
		}
		// commit 后清除这几个文件在 index 里可能残留的暂存状态
		if err := g.gitRestoreStaged(files); err != nil {
			log.Printf("[GitCommitter] git restore --staged failed: %v", err)
		}
		if err := g.gitPush(); err != nil {
			log.Printf("[GitCommitter] git push failed: %v", err)
			return
		}
		log.Printf("[GitCommitter] committed and pushed: %s", msg)
	}()
}

// gitCommitOnly 用 git commit --only -m "msg" -- <files>，
// 只提交这几个文件的工作区内容，不读也不写用户的 index。
func (g *GitCommitter) gitCommitOnly(message string, files []string) error {
	args := []string{"commit", "--only", "-m", message, "--"}
	args = append(args, files...)
	return g.run("git", args...)
}

// gitRestoreStaged 清除指定文件在暂存区里的残留状态。
func (g *GitCommitter) gitRestoreStaged(files []string) error {
	args := append([]string{"restore", "--staged"}, files...)
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
