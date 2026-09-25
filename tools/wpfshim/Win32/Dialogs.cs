using System;
using System.Collections.Generic;
using System.IO;
using System.Windows;
using WpfShim;

namespace Microsoft.Win32
{
    /// <summary>파일 대화상자: 브라우저 메모리 안의 작업 폴더(/work) 를 대상으로 한다</summary>
    public abstract class FileDialog
    {
        public string FileName { get; set; } = "";
        public string[] FileNames { get; set; } = Array.Empty<string>();
        public string SafeFileName => Path.GetFileName(FileName);
        public string Filter { get; set; } = "";
        public int FilterIndex { get; set; } = 1;
        public string Title { get; set; } = "";
        public string InitialDirectory { get; set; } = "";
        public string DefaultExt { get; set; } = "";
        public bool AddExtension { get; set; } = true;
        public bool CheckFileExists { get; set; }
        public bool CheckPathExists { get; set; } = true;
        public bool RestoreDirectory { get; set; }
        public bool ValidateNames { get; set; } = true;
        public event EventHandler? FileOk;
        internal abstract string Kind { get; }
        public bool? ShowDialog() => ShowDialog(null);
        public bool? ShowDialog(Window? owner)
        {
            var dir = string.IsNullOrEmpty(InitialDirectory) ? Directory.GetCurrentDirectory() : InitialDirectory;
            var files = new List<string>();
            try { if (Directory.Exists(dir)) foreach (var f in Directory.GetFiles(dir)) files.Add(Path.GetFileName(f)); } catch { }
            var payload = UiTree.Json(new { kind = Kind, title = Title, filter = Filter, fileName = FileName, defaultExt = DefaultExt, dir, files });
            var r = UiTree.SyncCall("filedialog", payload);
            if (string.IsNullOrEmpty(r)) return null;
            var name = r.Trim('"');
            if (name.Length == 0) return false;
            if (AddExtension && !string.IsNullOrEmpty(DefaultExt) && !Path.HasExtension(name)) name += (DefaultExt.StartsWith(".") ? "" : ".") + DefaultExt;
            FileName = Path.IsPathRooted(name) ? name : Path.Combine(dir, name);
            FileNames = new[] { FileName };
            FileOk?.Invoke(this, EventArgs.Empty);
            return true;
        }
        public Stream OpenFile() => Kind == "open" ? File.OpenRead(FileName) : File.Create(FileName);
    }
    public class OpenFileDialog : FileDialog
    {
        public bool Multiselect { get; set; }
        public bool ReadOnlyChecked { get; set; }
        public bool ShowReadOnly { get; set; }
        internal override string Kind => "open";
        public OpenFileDialog() { CheckFileExists = true; }
    }
    public class SaveFileDialog : FileDialog
    {
        public bool OverwritePrompt { get; set; } = true;
        public bool CreatePrompt { get; set; }
        internal override string Kind => "save";
    }
    public class OpenFolderDialog
    {
        public string FolderName { get; set; } = "";
        public string Title { get; set; } = "";
        public bool? ShowDialog() { FolderName = Directory.GetCurrentDirectory(); return true; }
    }
}

namespace System.Windows.Forms
{
    /// <summary>WinForms 의 FolderBrowserDialog 를 쓰는 예제를 위한 최소 호환</summary>
    public class FolderBrowserDialog : IDisposable
    {
        public string SelectedPath { get; set; } = "";
        public string Description { get; set; } = "";
        public DialogResult ShowDialog() { SelectedPath = System.IO.Directory.GetCurrentDirectory(); return DialogResult.OK; }
        public void Dispose() { }
    }
    public enum DialogResult { None, OK, Cancel, Abort, Retry, Ignore, Yes, No }
}
