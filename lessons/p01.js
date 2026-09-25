/* Project 01. 콘솔 성적 관리 프로그램 (Console Grade Manager) */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  /* ---------- 여러 예제에서 함께 쓰는 C# 코드 조각 (예제마다 완전한 프로그램이 되도록 끼워 넣는다) ---------- */
  const CS_STUDENT = `class Student
{
    public string Name { get; }
    public int Kor { get; set; }
    public int Eng { get; set; }
    public int Mat { get; set; }   // 수학 (Math 는 System.Math 와 헷갈려서 Mat)

    public Student(string name, int kor, int eng, int mat)
    {
        Name = name; Kor = kor; Eng = eng; Mat = mat;
    }

    public int Total => Kor + Eng + Mat;
    public double Average => Total / 3.0;
    public string Grade => Average switch
    {
        >= 90 => "A",
        >= 80 => "B",
        >= 70 => "C",
        >= 60 => "D",
        _ => "F"
    };
}`;

  const CS_READ = `    static int ReadInt(string prompt, int min, int max)
    {
        while (true)
        {
            Console.Write(prompt);
            string? line = Console.ReadLine();
            if (line == null) return min;          // 입력 끝(EOF) → 무한 반복 방지
            if (int.TryParse(line, out int value) && value >= min && value <= max)
                return value;
            Console.WriteLine($"  → {min}~{max} 사이의 정수를 입력하세요.");
        }
    }

    static string ReadName(string prompt)
    {
        while (true)
        {
            Console.Write(prompt);
            string? line = Console.ReadLine();
            if (line == null) return "";
            line = line.Trim();
            if (line != "") return line;
            Console.WriteLine("  → 이름을 입력하세요.");
        }
    }`;

  const CS_SAMPLE = `    static void AddSample()
    {
        students.Add(new Student("김민준", 90, 85, 77));
        students.Add(new Student("이서연", 72, 64, 80));
        students.Add(new Student("박지호", 95, 92, 98));
        students.Add(new Student("최유나", 58, 70, 61));
        students.Add(new Student("정하준", 85, 80, 87));
    }`;

  const CS_LIST = `    static void PrintList()
    {
        if (students.Count == 0) { Console.WriteLine("등록된 학생이 없습니다."); return; }
        Console.WriteLine("번호 이름      국어 영어 수학  총점   평균 등급");
        Console.WriteLine(new string('-', 46));
        for (int i = 0; i < students.Count; i++)
        {
            Student s = students[i];
            Console.WriteLine($"{i + 1,3}  {s.Name,-6}{s.Kor,5}{s.Eng,5}{s.Mat,5}{s.Total,6}{s.Average,7:F1}{s.Grade,4}");
        }
    }`;

  /* ---------- SVG 그림 ---------- */
  const SVG_DESIGN = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="성적 관리 프로그램의 클래스 설계">
  <defs><marker id="ap1a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="30" y="40" width="400" height="470" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <rect x="30" y="40" width="400" height="60" rx="12" fill="var(--accent)" opacity="0.18"/>
  <text x="230" y="80" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">class Student</text>
  <text x="230" y="128" text-anchor="middle" style="font-size:18px;fill:var(--muted)">학생 한 명 (데이터)</text>
  <g style="${MONO};font-size:21px;fill:var(--fg)">
    <text x="50" y="170">string Name</text>
    <text x="50" y="205">int Kor, Eng, Mat</text>
  </g>
  <line x1="50" y1="228" x2="410" y2="228" stroke="var(--line)" stroke-dasharray="6 6"/>
  <text x="50" y="258" style="font-size:18px;fill:var(--muted)">계산 속성 (=&gt;) — 저장하지 않고 계산</text>
  <g style="${MONO};font-size:21px;fill:var(--ok)">
    <text x="50" y="293">int Total</text>
    <text x="50" y="328">double Average</text>
    <text x="50" y="363">string Grade</text>
  </g>
  <line x1="50" y1="388" x2="410" y2="388" stroke="var(--line)" stroke-dasharray="6 6"/>
  <text x="50" y="418" style="font-size:18px;fill:var(--muted)">파일 저장용 (4교시)</text>
  <g style="${MONO};font-size:19px;fill:var(--accent2)">
    <text x="50" y="453">string ToCsv()</text>
    <text x="50" y="485">static Student? FromCsv(line)</text>
  </g>
  <rect x="490" y="40" width="360" height="470" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <rect x="490" y="40" width="360" height="60" rx="12" fill="var(--accent2)" opacity="0.18"/>
  <text x="670" y="80" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">class GradeBook</text>
  <text x="670" y="128" text-anchor="middle" style="font-size:18px;fill:var(--muted)">학생 목록 관리 (Console 없음)</text>
  <g style="${MONO};font-size:20px;fill:var(--fg)">
    <text x="510" y="170">List&lt;Student&gt; students</text>
  </g>
  <line x1="510" y1="195" x2="830" y2="195" stroke="var(--line)" stroke-dasharray="6 6"/>
  <g style="${MONO};font-size:20px;fill:var(--fg)">
    <text x="510" y="232">Add · Find · Search</text>
    <text x="510" y="270">Remove</text>
    <text x="510" y="308">Ranked()  석차순</text>
    <text x="510" y="346">RankOf(s)</text>
    <text x="510" y="384">Save(path)</text>
    <text x="510" y="422">Load(path)</text>
  </g>
  <text x="670" y="480" text-anchor="middle" style="font-size:18px;fill:var(--muted)">LINQ · File 로 데이터만 다룬다</text>
  <rect x="910" y="40" width="340" height="470" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <rect x="910" y="40" width="340" height="60" rx="12" fill="var(--ok)" opacity="0.18"/>
  <text x="1080" y="80" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">class Program</text>
  <text x="1080" y="128" text-anchor="middle" style="font-size:18px;fill:var(--muted)">화면 · 입력 · 메뉴</text>
  <g style="${MONO};font-size:20px;fill:var(--fg)">
    <text x="930" y="170">Main()  메뉴 반복</text>
    <text x="930" y="210">ReadInt · ReadName</text>
    <text x="930" y="250">AddStudent()</text>
    <text x="930" y="290">PrintList · PrintRanking</text>
    <text x="930" y="330">PrintStats · Search</text>
    <text x="930" y="370">Delete · Save · Load</text>
  </g>
  <text x="1080" y="440" text-anchor="middle" style="font-size:18px;fill:var(--muted)">Console.Write / ReadLine 은</text>
  <text x="1080" y="466" text-anchor="middle" style="font-size:18px;fill:var(--muted)">여기에서만 쓴다</text>
  <path d="M905,250 L857,250" stroke="var(--accent)" stroke-width="3" fill="none" marker-end="url(#ap1a)"/>
  <path d="M485,170 L437,170" stroke="var(--accent)" stroke-width="3" fill="none" marker-end="url(#ap1a)"/>
  <text x="640" y="545" text-anchor="middle" style="font-size:20px;fill:var(--muted)">화살표 = “사용한다” · 2~3교시에는 Program 안의 static List 로 시작하고, 4교시에 GradeBook 으로 분리한다</text>
</svg>`;

  const SVG_FLOW = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="메뉴 반복 흐름도">
  <defs><marker id="ap1b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--fg)"/></marker></defs>
  <g stroke="var(--fg)" stroke-width="3" fill="none">
    <path d="M160,95 L160,135" marker-end="url(#ap1b)"/>
    <path d="M160,205 L160,245" marker-end="url(#ap1b)"/>
    <path d="M160,315 L160,350" marker-end="url(#ap1b)"/>
    <path d="M270,395 L400,395" marker-end="url(#ap1b)"/>
    <path d="M160,440 L160,480" marker-end="url(#ap1b)"/>
    <path d="M620,395 L680,395" marker-end="url(#ap1b)"/>
    <path d="M1200,395 L1240,395 L1240,170 L275,170" marker-end="url(#ap1b)"/>
  </g>
  <rect x="50" y="40" width="220" height="55" rx="27" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="160" y="76" text-anchor="middle" style="font-size:22px;fill:var(--fg)">시작 (학생 0명)</text>
  <rect x="50" y="140" width="220" height="65" rx="8" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="160" y="180" text-anchor="middle" style="font-size:22px;fill:var(--fg)">PrintMenu()</text>
  <rect x="30" y="250" width="260" height="65" rx="8" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="160" y="290" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">Console.ReadLine()</text>
  <path d="M160,350 L270,395 L160,440 L50,395 z" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="160" y="402" text-anchor="middle" style="font-size:19px;fill:var(--fg)">null 또는 "0"?</text>
  <text x="300" y="385" style="font-size:18px;fill:var(--muted)">아니오</text>
  <text x="175" y="468" style="font-size:18px;fill:var(--muted)">예</text>
  <rect x="50" y="485" width="220" height="55" rx="27" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="160" y="520" text-anchor="middle" style="font-size:22px;fill:var(--fg)">종료 (break)</text>
  <rect x="405" y="355" width="215" height="80" rx="8" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="512" y="402" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">switch (input)</text>
  <g style="font-size:19px;fill:var(--fg)">
    <rect x="685" y="222" width="165" height="44" rx="6" fill="var(--card)" stroke="var(--ok)" stroke-width="2"/><text x="767" y="251" text-anchor="middle">"1" 추가</text>
    <rect x="685" y="276" width="165" height="44" rx="6" fill="var(--card)" stroke="var(--ok)" stroke-width="2"/><text x="767" y="305" text-anchor="middle">"2" 목록</text>
    <rect x="685" y="330" width="165" height="44" rx="6" fill="var(--card)" stroke="var(--ok)" stroke-width="2"/><text x="767" y="359" text-anchor="middle">"3" 석차</text>
    <rect x="860" y="222" width="165" height="44" rx="6" fill="var(--card)" stroke="var(--ok)" stroke-width="2"/><text x="942" y="251" text-anchor="middle">"4" 검색</text>
    <rect x="860" y="276" width="165" height="44" rx="6" fill="var(--card)" stroke="var(--ok)" stroke-width="2"/><text x="942" y="305" text-anchor="middle">"5" 통계</text>
    <rect x="860" y="330" width="165" height="44" rx="6" fill="var(--card)" stroke="var(--ok)" stroke-width="2"/><text x="942" y="359" text-anchor="middle">"6" 삭제</text>
    <rect x="1035" y="222" width="165" height="44" rx="6" fill="var(--card)" stroke="var(--accent2)" stroke-width="2"/><text x="1117" y="251" text-anchor="middle">"7" 저장</text>
    <rect x="1035" y="276" width="165" height="44" rx="6" fill="var(--card)" stroke="var(--accent2)" stroke-width="2"/><text x="1117" y="305" text-anchor="middle">"8" 불러오기</text>
    <rect x="1035" y="330" width="165" height="44" rx="6" fill="var(--card)" stroke="var(--danger)" stroke-width="2"/><text x="1117" y="359" text-anchor="middle">default: 오류</text>
  </g>
  <rect x="678" y="210" width="530" height="175" rx="10" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="943" y="430" text-anchor="middle" style="font-size:20px;fill:var(--muted)">case 마다 메서드 하나를 부르고 break (C# 은 fall-through 금지)</text>
  <text x="720" y="158" style="font-size:20px;fill:var(--muted)">처리가 끝나면 다시 메뉴로 — while (true)</text>
</svg>`;

  const SVG_PLAN = `<svg viewBox="0 0 1280 400" width="100%" role="img" aria-label="단계별 구현 계획">
  <g style="font-size:19px">
    <path d="M15,120 L150,120 L172,190 L150,260 L15,260 L37,190 z" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="93" y="180" text-anchor="middle" style="font-weight:700;fill:var(--accent)">단계 1</text><text x="93" y="212" text-anchor="middle" style="fill:var(--fg)">추가 · 목록</text>
    <path d="M172,120 L307,120 L329,190 L307,260 L172,260 L194,190 z" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="250" y="180" text-anchor="middle" style="font-weight:700;fill:var(--accent)">단계 2</text><text x="250" y="212" text-anchor="middle" style="fill:var(--fg)">메뉴 연결</text>
    <path d="M329,120 L464,120 L486,190 L464,260 L329,260 L351,190 z" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="407" y="180" text-anchor="middle" style="font-weight:700;fill:var(--accent)">단계 3</text><text x="407" y="212" text-anchor="middle" style="fill:var(--fg)">검색</text>
    <path d="M486,120 L621,120 L643,190 L621,260 L486,260 L508,190 z" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="564" y="180" text-anchor="middle" style="font-weight:700;fill:var(--accent2)">단계 4</text><text x="564" y="212" text-anchor="middle" style="fill:var(--fg)">통계</text>
    <path d="M643,120 L778,120 L800,190 L778,260 L643,260 L665,190 z" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="721" y="180" text-anchor="middle" style="font-weight:700;fill:var(--accent2)">단계 5</text><text x="721" y="212" text-anchor="middle" style="fill:var(--fg)">석차 정렬</text>
    <path d="M800,120 L935,120 L957,190 L935,260 L800,260 L822,190 z" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="878" y="180" text-anchor="middle" style="font-weight:700;fill:var(--accent2)">단계 6</text><text x="878" y="212" text-anchor="middle" style="fill:var(--fg)">삭제</text>
    <path d="M957,120 L1092,120 L1114,190 L1092,260 L957,260 L979,190 z" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="1035" y="180" text-anchor="middle" style="font-weight:700;fill:var(--ok)">단계 7</text><text x="1035" y="212" text-anchor="middle" style="fill:var(--fg)">CSV 저장</text>
    <path d="M1114,120 L1249,120 L1271,190 L1249,260 L1114,260 L1136,190 z" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="1192" y="180" text-anchor="middle" style="font-weight:700;fill:var(--ok)">단계 8</text><text x="1192" y="212" text-anchor="middle" style="fill:var(--fg)">불러오기</text>
  </g>
  <text x="250" y="85" text-anchor="middle" style="font-size:22px;fill:var(--accent)">구현 ① (2교시)</text>
  <text x="721" y="85" text-anchor="middle" style="font-size:22px;fill:var(--accent2)">구현 ② (3교시)</text>
  <text x="1113" y="85" text-anchor="middle" style="font-size:22px;fill:var(--ok)">완성 (4교시)</text>
  <text x="640" y="320" text-anchor="middle" style="font-size:22px;fill:var(--muted)">단계가 끝날 때마다 “빌드 → 실행 → 확인” — 언제나 돌아가는 프로그램을 조금씩 키운다</text>
  <text x="640" y="360" text-anchor="middle" style="font-size:22px;fill:var(--muted)">4교시: 클래스 파일 분리(Student · GradeBook · Program) · 테스트 · 확장 과제</text>
</svg>`;

  const SVG_RANK = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="LINQ 로 석차순 정렬하고 석차 구하기">
  <defs><marker id="ap1c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="640" y="40" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">원본 목록은 그대로 두고, 정렬된 <tspan fill="var(--accent)">새 목록</tspan>을 만든다</text>
  <rect x="30" y="80" width="250" height="330" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="155" y="115" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">students (입력순)</text>
  <g style="font-size:20px;fill:var(--fg)">
    <text x="55" y="160">김민준 252</text><text x="55" y="205">이서연 216</text><text x="55" y="250">박지호 285</text>
    <text x="55" y="295">최유나 189</text><text x="55" y="340">정하준 252</text>
  </g>
  <path d="M285,245 L375,245" stroke="var(--accent)" stroke-width="3" fill="none" marker-end="url(#ap1c)"/>
  <rect x="380" y="150" width="340" height="190" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <g style="${MONO};font-size:20px;fill:var(--fg)">
    <text x="400" y="195">.OrderByDescending(</text><text x="430" y="225" fill="var(--accent)">s =&gt; s.Total)</text>
    <text x="400" y="265">.ThenBy(</text><text x="430" y="295" fill="var(--accent)">s =&gt; s.Name)</text>
    <text x="400" y="330">.ToList()</text>
  </g>
  <path d="M725,245 L815,245" stroke="var(--accent)" stroke-width="3" fill="none" marker-end="url(#ap1c)"/>
  <rect x="820" y="80" width="430" height="330" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="1035" y="115" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">ranked (새 목록) → 석차</text>
  <g style="font-size:20px;fill:var(--fg)">
    <text x="845" y="160">박지호 285</text><text x="1060" y="160" fill="var(--accent)">0명 위 → 1등</text>
    <text x="845" y="205">김민준 252</text><text x="1060" y="205" fill="var(--accent2)">1명 위 → 2등</text>
    <text x="845" y="250">정하준 252</text><text x="1060" y="250" fill="var(--accent2)">1명 위 → 2등</text>
    <text x="845" y="295">이서연 216</text><text x="1060" y="295" fill="var(--ok)">3명 위 → 4등</text>
    <text x="845" y="340">최유나 189</text><text x="1060" y="340" fill="var(--warn)">4명 위 → 5등</text>
  </g>
  <text x="640" y="455" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">int rank = students.Count(o =&gt; o.Total &gt; s.Total) + 1;</text>
  <text x="640" y="495" text-anchor="middle" style="font-size:20px;fill:var(--muted)">석차 = (나보다 총점이 높은 학생 수) + 1 → 동점(252)은 같은 석차, 그다음은 3등이 아니라 4등</text>
</svg>`;

  const SVG_CSV = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="CSV 저장과 불러오기">
  <defs><marker id="ap1d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker>
  <marker id="ap1e" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent2)"/></marker></defs>
  <rect x="30" y="60" width="330" height="400" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="195" y="100" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">메모리 (프로그램 실행 중)</text>
  <text x="195" y="130" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--muted)">List&lt;Student&gt;</text>
  <g style="font-size:19px;fill:var(--fg)">
    <rect x="55" y="155" width="280" height="60" rx="8" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="70" y="192">Student 김민준 90 85 77</text>
    <rect x="55" y="230" width="280" height="60" rx="8" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="70" y="267">Student 이서연 72 64 80</text>
    <rect x="55" y="305" width="280" height="60" rx="8" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="70" y="342">Student 박지호 95 92 98</text>
  </g>
  <text x="195" y="420" text-anchor="middle" style="font-size:19px;fill:var(--danger)">프로그램을 끄면 사라진다</text>
  <path d="M365,170 L905,170" stroke="var(--ok)" stroke-width="4" fill="none" marker-end="url(#ap1d)"/>
  <text x="635" y="130" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--ok)">저장 (Save)</text>
  <text x="635" y="205" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">students.Select(s =&gt; s.ToCsv())</text>
  <text x="635" y="235" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">File.WriteAllLines(path, lines)</text>
  <path d="M905,350 L365,350" stroke="var(--accent2)" stroke-width="4" fill="none" marker-end="url(#ap1e)"/>
  <text x="635" y="310" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--accent2)">불러오기 (Load)</text>
  <text x="635" y="385" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">File.ReadAllLines(path)</text>
  <text x="635" y="415" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">line.Split(',') + int.TryParse</text>
  <text x="635" y="445" text-anchor="middle" style="font-size:18px;fill:var(--muted)">잘못된 줄은 건너뛰고 개수를 알려 준다</text>
  <rect x="910" y="60" width="340" height="400" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="1080" y="100" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">파일 grades.csv</text>
  <text x="1080" y="130" text-anchor="middle" style="font-size:18px;fill:var(--muted)">한 줄 = 학생 한 명, 쉼표로 구분</text>
  <g style="${MONO};font-size:21px;fill:var(--fg)">
    <text x="935" y="192">김민준,90,85,77</text>
    <text x="935" y="267">이서연,72,64,80</text>
    <text x="935" y="342">박지호,95,92,98</text>
  </g>
  <text x="1080" y="420" text-anchor="middle" style="font-size:19px;fill:var(--ok)">꺼도 남는다 (메모장으로 열림)</text>
  <text x="640" y="500" text-anchor="middle" style="font-size:20px;fill:var(--muted)">총점 · 평균 · 등급은 저장하지 않는다 — 점수만 있으면 언제든 다시 계산할 수 있으니까</text>
</svg>`;

  /* ---------- 완성 프로그램 (4교시) ---------- */
  const FINAL_CODE = `// ===== File: Student.cs =====
using System;

class Student
{
    public string Name { get; }
    public int Kor { get; set; }
    public int Eng { get; set; }
    public int Mat { get; set; }

    public Student(string name, int kor, int eng, int mat)
    {
        Name = name; Kor = kor; Eng = eng; Mat = mat;
    }

    public int Total => Kor + Eng + Mat;
    public double Average => Total / 3.0;
    public string Grade => Average switch
    {
        >= 90 => "A",
        >= 80 => "B",
        >= 70 => "C",
        >= 60 => "D",
        _ => "F"
    };

    public static bool IsScore(int n) => n >= 0 && n <= 100;

    public string ToCsv() => $"{Name},{Kor},{Eng},{Mat}";

    // CSV 한 줄 → Student. 형식이 틀리면 null
    public static Student? FromCsv(string line)
    {
        string[] p = line.Split(',');
        if (p.Length != 4 || p[0].Trim() == "") return null;
        if (!int.TryParse(p[1], out int kor) || !int.TryParse(p[2], out int eng) || !int.TryParse(p[3], out int mat))
            return null;
        if (!IsScore(kor) || !IsScore(eng) || !IsScore(mat)) return null;
        return new Student(p[0].Trim(), kor, eng, mat);
    }
}

// ===== File: GradeBook.cs =====
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

// 학생 목록을 관리한다 (Console 입출력은 하지 않는다)
class GradeBook
{
    private readonly List<Student> students = new List<Student>();

    public int Count => students.Count;
    public IReadOnlyList<Student> All => students;

    public bool Contains(string name) => students.Any(s => s.Name == name);
    public void Add(Student s) => students.Add(s);
    public Student? Find(string name) => students.Find(s => s.Name == name);
    public List<Student> Search(string key) => students.Where(s => s.Name.Contains(key)).ToList();
    public bool Remove(string name) => students.RemoveAll(s => s.Name == name) > 0;

    public List<Student> Ranked() =>
        students.OrderByDescending(s => s.Total).ThenBy(s => s.Name).ToList();

    public int RankOf(Student s) => students.Count(o => o.Total > s.Total) + 1;

    public void Save(string path) =>
        File.WriteAllLines(path, students.Select(s => s.ToCsv()));

    // 불러온 학생 수를 돌려주고, 건너뛴 줄 수는 out 으로 알려 준다
    public int Load(string path, out int skipped)
    {
        skipped = 0;
        var loaded = new List<Student>();
        foreach (string line in File.ReadAllLines(path))
        {
            if (string.IsNullOrWhiteSpace(line)) continue;
            Student? s = Student.FromCsv(line);
            if (s == null || loaded.Any(x => x.Name == s.Name)) { skipped++; continue; }
            loaded.Add(s);
        }
        students.Clear();
        students.AddRange(loaded);
        return loaded.Count;
    }
}

// ===== File: Program.cs =====
using System;
using System.IO;
using System.Linq;

class Program
{
    const string FileName = "grades.csv";
    static GradeBook book = new GradeBook();

    static void Main()
    {
        while (true)
        {
            Console.WriteLine();
            Console.WriteLine("=== 성적 관리 프로그램 ===");
            Console.WriteLine("1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료");
            Console.Write("선택: ");
            string? input = Console.ReadLine();
            if (input == null || input.Trim() == "0")
            {
                Console.WriteLine("프로그램을 종료합니다.");
                break;
            }
            switch (input.Trim())
            {
                case "1": AddStudent(); break;
                case "2": PrintList(); break;
                case "3": PrintRanking(); break;
                case "4": Search(); break;
                case "5": PrintStats(); break;
                case "6": Delete(); break;
                case "7": Save(); break;
                case "8": Load(); break;
                default: Console.WriteLine("잘못된 선택입니다."); break;
            }
        }
    }

    static int ReadInt(string prompt, int min, int max)
    {
        while (true)
        {
            Console.Write(prompt);
            string? line = Console.ReadLine();
            if (line == null) return min;
            if (int.TryParse(line, out int value) && value >= min && value <= max)
                return value;
            Console.WriteLine($"  → {min}~{max} 사이의 정수를 입력하세요.");
        }
    }

    static string ReadLineTrim(string prompt)
    {
        Console.Write(prompt);
        return (Console.ReadLine() ?? "").Trim();
    }

    static void AddStudent()
    {
        string name = ReadLineTrim("이름: ");
        if (name == "" || name.Contains(','))
        {
            Console.WriteLine("이름이 비었거나 쉼표(,)가 들어 있습니다.");
            return;
        }
        if (book.Contains(name))
        {
            Console.WriteLine($"{name} 학생은 이미 등록되어 있습니다.");
            return;
        }
        int kor = ReadInt("국어: ", 0, 100);
        int eng = ReadInt("영어: ", 0, 100);
        int mat = ReadInt("수학: ", 0, 100);
        book.Add(new Student(name, kor, eng, mat));
        Console.WriteLine($"{name} 추가 완료 (현재 {book.Count}명)");
    }

    static bool IsEmpty()
    {
        if (book.Count > 0) return false;
        Console.WriteLine("등록된 학생이 없습니다.");
        return true;
    }

    static void PrintList()
    {
        if (IsEmpty()) return;
        Console.WriteLine("번호 이름      국어 영어 수학  총점   평균 등급");
        Console.WriteLine(new string('-', 46));
        int no = 1;
        foreach (Student s in book.All)
            Console.WriteLine($"{no++,3}  {s.Name,-6}{s.Kor,5}{s.Eng,5}{s.Mat,5}{s.Total,6}{s.Average,7:F1}{s.Grade,4}");
    }

    static void PrintRanking()
    {
        if (IsEmpty()) return;
        Console.WriteLine("석차 이름      총점   평균 등급");
        Console.WriteLine(new string('-', 31));
        foreach (Student s in book.Ranked())
            Console.WriteLine($"{book.RankOf(s),3}  {s.Name,-6}{s.Total,5}{s.Average,7:F1}{s.Grade,4}");
    }

    static void Search()
    {
        string key = ReadLineTrim("검색할 이름(일부도 가능): ");
        if (key == "") { Console.WriteLine("검색어가 비었습니다."); return; }
        var found = book.Search(key);
        if (found.Count == 0) { Console.WriteLine($"'{key}' 학생이 없습니다."); return; }
        foreach (Student s in found)
            Console.WriteLine($"  {s.Name}: 국어 {s.Kor}, 영어 {s.Eng}, 수학 {s.Mat} → 평균 {s.Average:F1} ({s.Grade}), {book.RankOf(s)}등");
    }

    static void PrintSubject(string title, Func<Student, int> score)
    {
        var all = book.All;
        Console.WriteLine($"{title}  평균 {all.Average(score),5:F1}  최고 {all.Max(score),3}  최저 {all.Min(score),3}");
    }

    static void PrintStats()
    {
        if (IsEmpty()) return;
        var all = book.All;
        Console.WriteLine($"학생 수: {all.Count}명, 반 평균: {all.Average(s => s.Average):F1}");
        PrintSubject("국어", s => s.Kor);
        PrintSubject("영어", s => s.Eng);
        PrintSubject("수학", s => s.Mat);
        Student best = all.MaxBy(s => s.Total)!;
        Console.WriteLine($"최우수: {best.Name} (총점 {best.Total})");
        var grades = all.GroupBy(s => s.Grade).OrderBy(g => g.Key)
                        .Select(g => $"{g.Key} {g.Count()}명");
        Console.WriteLine("등급 분포: " + string.Join(", ", grades));
    }

    static void Delete()
    {
        string name = ReadLineTrim("삭제할 이름: ");
        if (!book.Contains(name)) { Console.WriteLine($"'{name}' 학생이 없습니다."); return; }
        string answer = ReadLineTrim($"{name} 학생을 삭제할까요? (y/n): ").ToLower();
        if (answer == "y" && book.Remove(name))
            Console.WriteLine($"삭제했습니다. (남은 학생 {book.Count}명)");
        else
            Console.WriteLine("취소했습니다.");
    }

    static void Save()
    {
        try
        {
            book.Save(FileName);
            Console.WriteLine($"{FileName} 에 {book.Count}명을 저장했습니다.");
        }
        catch (IOException ex)
        {
            Console.WriteLine($"저장 실패: {ex.Message}");
        }
    }

    static void Load()
    {
        if (!File.Exists(FileName)) { Console.WriteLine($"{FileName} 파일이 없습니다."); return; }
        try
        {
            int n = book.Load(FileName, out int skipped);
            Console.WriteLine($"{n}명을 불러왔습니다." + (skipped > 0 ? $" (잘못된 줄 {skipped}개 건너뜀)" : ""));
        }
        catch (IOException ex)
        {
            Console.WriteLine($"불러오기 실패: {ex.Message}");
        }
    }
}`;

  const FINAL_STDIN = '2\n1\n김민준\n90\n85\n77\n1\n이서연\n72\n64\n80\n1\n박지호\n95\n92\n98\n1\n최유나\n58\n칠십\n70\n61\n1\n김민준\n1\n정하준\n85\n80\n187\n87\n2\n3\n4\n준\n5\n7\n6\n최유나\ny\n6\n이서연\nn\n2\n8\n3\n9\n0\n';

  CS_COURSE.addChapter({
    id: 'p01',
    no: 'P01',
    title: '콘솔 성적 관리 프로그램',
    subtitle: 'Project · Console Grade Manager',
    summary: '클래스 · List · 메서드 · 입력 검증(int.TryParse) · LINQ · 파일 입출력을 모두 모아, 학생 성적을 추가 · 목록 · 석차 · 검색 · 통계 · 삭제하고 CSV 파일로 저장 · 불러오는 메뉴형 콘솔 프로그램을 단계별로 완성합니다.',
    goals: [
      '요구사항을 기능 목록과 클래스 설계(Student · GradeBook · Program)로 옮길 수 있다',
      '계산 속성(=>)으로 총점 · 평균 · 등급을 자동으로 계산하는 클래스를 만들 수 있다',
      'int.TryParse 로 잘못된 입력을 걸러 내는 입력 메서드와 메뉴 반복(while + switch)을 작성할 수 있다',
      'List<Student> 와 LINQ(Where · OrderByDescending · Average · Max · GroupBy)로 검색 · 정렬 · 통계를 구현할 수 있다',
      'File.WriteAllLines / ReadAllLines 와 Split 으로 데이터를 CSV 파일에 저장하고 안전하게 불러올 수 있다',
      '작은 단계로 나누어 “언제나 실행되는 프로그램”을 키워 가는 개발 방식을 경험한다'
    ],
    requires: ['ch05', 'ch06', 'ch07', 'ch08', 'ch10', 'ch11'],
    preview: `=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 3
석차 이름      총점   평균 등급
-------------------------------
  1  박지호     285   95.0   A
  2  김민준     252   84.0   B
  2  정하준     252   84.0   B
  4  이서연     216   72.0   C
  5  최유나     189   63.0   D

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 5
학생 수: 5명, 반 평균: 79.6
국어  평균  80.0  최고  95  최저  58
영어  평균  78.2  최고  92  최저  64
수학  평균  80.6  최고  98  최저  61
최우수: 박지호 (총점 285)
등급 분포: A 1명, B 2명, C 1명, D 1명`,
    sections: [
      /* =========================================================== 1교시 */
      {
        id: 'p01-1',
        title: '요구사항 분석과 설계',
        minutes: 50,
        goals: [
          '성적 관리 프로그램의 요구사항을 기능 목록과 규칙으로 정리할 수 있다',
          '학생 한 명을 Student 클래스로 설계하고, 계산 속성으로 총점 · 평균 · 등급을 만들 수 있다',
          'int.TryParse 로 잘못된 입력을 다시 묻는 입력 메서드를 작성할 수 있다',
          '메뉴 반복(while + switch) 뼈대와 단계별 구현 계획을 세울 수 있다'
        ],
        flow: [['도입 · 완성품 시연', 5], ['요구사항 · 기능 목록', 10], ['클래스 설계', 12], ['입력 · 메뉴 뼈대', 15], ['정리 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '무엇을 만들까? — 완성 프로그램 미리 보기' },
          { type: 'p', html: '첫 번째 응용 프로젝트에서는 C# 기초 파트에서 배운 <b>조건문 · 반복문 · 메서드 · 컬렉션 · 클래스 · 예외 · 파일 · LINQ</b>를 한데 모아 <b>성적 관리 프로그램</b>을 만듭니다. 학생의 이름과 국어 · 영어 · 수학 점수를 입력하면 <b>총점 · 평균 · 등급 · 석차</b>를 계산해 표로 보여 주고, 검색 · 통계 · 삭제를 할 수 있으며, 데이터를 <b>파일로 저장</b>해 두었다가 다음에 다시 불러올 수 있습니다.' },
          { type: 'p', html: '완성된 프로그램은 번호를 골라 기능을 실행하는 <b>메뉴형 콘솔 프로그램</b>입니다. 기능을 실행한 뒤에는 다시 메뉴로 돌아오고, <code>0</code> 을 고를 때까지 반복합니다.' },
          { type: 'p', html: '<pre><code>=== 성적 관리 프로그램 ===\n1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료\n선택: 3\n석차 이름      총점   평균 등급\n-------------------------------\n  1  박지호     285   95.0   A\n  2  김민준     252   84.0   B\n  2  정하준     252   84.0   B\n  4  이서연     216   72.0   C\n  5  최유나     189   63.0   D</code></pre>' },
          { type: 'h', text: '요구사항 분석 (Requirements Analysis)' },
          { type: 'p', html: '코드를 쓰기 전에 <b>“프로그램이 무엇을 해야 하는가”</b>를 글로 정리하는 단계를 <b>요구사항 분석</b>이라고 합니다. 프로그램이 할 일을 적은 <b>기능 요구사항</b>과, 지켜야 할 규칙을 적은 <b>비기능 요구사항</b>으로 나누어 봅시다.' },
          { type: 'table', caption: '기능 요구사항 (Functional Requirements)', head: ['메뉴', '기능', '설명'], rows: [
            ['1', '학생 추가', '이름과 국어 · 영어 · 수학 점수(0~100)를 입력받아 저장한다. 같은 이름은 거절한다'],
            ['2', '목록', '입력한 순서대로 점수 · 총점 · 평균 · 등급을 표로 출력한다'],
            ['3', '석차', '총점이 높은 순서로 출력한다 (동점이면 이름순, 같은 석차)'],
            ['4', '검색', '이름(일부도 가능)으로 학생을 찾아 성적과 석차를 보여 준다'],
            ['5', '통계', '반 평균, 과목별 평균 · 최고 · 최저, 최우수 학생, 등급 분포'],
            ['6', '삭제', '이름으로 찾아 확인(y/n) 후 삭제한다'],
            ['7 / 8', '저장 / 불러오기', '학생 목록을 CSV 파일(<code>grades.csv</code>)에 저장하고 다시 읽는다'],
            ['0', '종료', '프로그램을 끝낸다']
          ] },
          { type: 'table', caption: '비기능 요구사항 / 규칙', head: ['항목', '규칙'], rows: [
            ['등급', '평균 90 이상 A, 80 이상 B, 70 이상 C, 60 이상 D, 그 외 F'],
            ['석차', '총점 기준. 동점자는 같은 석차 (예: 1, 2, 2, 4)'],
            ['출력', '평균은 소수점 첫째 자리까지, 표의 열을 가지런히'],
            ['입력 오류', '점수가 숫자가 아니거나 0~100 밖이면 <b>다시 입력</b>. 프로그램이 멈추면(예외) 안 된다'],
            ['파일', '파일에 잘못된 줄이 있어도 멈추지 않고 건너뛴 뒤 몇 줄을 건너뛰었는지 알려 준다']
          ] },
          { type: 'callout', kind: 'tip', title: '요구사항은 “확인할 수 있게” 쓴다', html: '“입력을 잘 처리한다” 보다 “점수가 숫자가 아니거나 0~100 밖이면 다시 묻는다” 처럼 쓰면, 완성한 뒤 <code>abc</code> · <code>150</code> 을 넣어 보며 <b>맞게 만들었는지 확인(테스트)</b>할 수 있습니다. 좋은 요구사항 목록은 그대로 테스트 목록이 됩니다.' },
          { type: 'h', text: '클래스 설계 — 누가 무엇을 맡을까?' },
          { type: 'p', html: '8장에서 배운 것처럼, 서로 관련된 데이터와 동작은 <b>클래스</b>로 묶습니다. 이 프로그램은 역할에 따라 세 클래스로 나눕니다.' },
          { type: 'list', items: [
            '<b><code>Student</code></b> — 학생 한 명의 데이터(이름, 세 과목 점수)와 그로부터 계산되는 값(총점 · 평균 · 등급)',
            '<b><code>GradeBook</code></b> — 학생 여러 명을 <code>List&lt;Student&gt;</code> 로 보관하고 추가 · 검색 · 정렬 · 저장을 맡는 “성적부”',
            '<b><code>Program</code></b> — 메뉴를 보여 주고 키보드 입력을 받아 알맞은 기능을 부르는 “화면” 담당'
          ] },
          { type: 'figure', html: SVG_DESIGN, caption: '클래스 설계 — Student(데이터) · GradeBook(목록 관리) · Program(화면 · 입력). 2~3교시에는 Program 안에 static List 를 두고 시작한다' },
          { type: 'p', html: '총점 · 평균 · 등급은 점수만 알면 언제든 계산할 수 있습니다. 그래서 필드에 따로 저장하지 않고 <b>계산 속성(expression-bodied property, <code>=&gt;</code>)</b>으로 만듭니다. 점수를 고치면 총점과 등급이 <b>자동으로</b> 따라 바뀌므로, “점수는 고쳤는데 총점은 옛날 값” 같은 버그가 생기지 않습니다.' },
          { type: 'code', title: '예제 P1-1. Student 클래스 — 계산 속성으로 총점 · 평균 · 등급', code: `using System;

${CS_STUDENT}

class Program
{
    static void Main()
    {
        Student s = new Student("김민준", 90, 85, 77);
        Console.WriteLine($"{s.Name}: 총점 {s.Total}, 평균 {s.Average:F1}, 등급 {s.Grade}");

        s.Mat = 100;   // 수학 점수를 고치면
        Console.WriteLine($"{s.Name}: 총점 {s.Total}, 평균 {s.Average:F1}, 등급 {s.Grade}");

        Student t = new Student("최유나", 58, 70, 61);
        Console.WriteLine($"{t.Name}: 총점 {t.Total}, 평균 {t.Average:F1}, 등급 {t.Grade}");
    }
}`, expect: `김민준: 총점 252, 평균 84.0, 등급 B
김민준: 총점 275, 평균 91.7, 등급 A
최유나: 총점 189, 평균 63.0, 등급 D`, desc: '<code>Name</code> 은 <code>{ get; }</code> 만 있어 생성자에서 한 번 정하면 바꿀 수 없고(읽기 전용), 점수는 <code>{ get; set; }</code> 이라 고칠 수 있습니다. <code>Total</code> · <code>Average</code> · <code>Grade</code> 는 <code>=&gt;</code> 로 만든 <b>계산 속성</b>이라 읽을 때마다 새로 계산됩니다. 수학 점수를 100 으로 고치자 총점 · 평균 · 등급이 모두 바뀐 것을 확인하세요. <code>Grade</code> 는 12장의 <b>switch 식</b>과 관계 패턴(<code>&gt;= 90</code>)을 썼습니다.' },
          { type: 'callout', kind: 'warn', title: '흔한 실수: 정수 나눗셈', html: '<code>Total / 3</code> 은 <code>int</code> ÷ <code>int</code> 라서 소수점이 버려집니다. 총점 250 이면 83.333… 이 아니라 <b>83</b> 이 됩니다. 반드시 <code>Total / 3.0</code> 처럼 한쪽을 <code>double</code> 로 만드세요.' },
          { type: 'h', text: '입력 설계 — 사용자는 언제든 틀린다' },
          { type: 'p', html: '점수를 <code>int.Parse(Console.ReadLine())</code> 로 받으면 사용자가 <code>abc</code> 를 입력하는 순간 <code>FormatException</code> 으로 프로그램이 멈춥니다. 10장에서 배운 <b><code>int.TryParse</code></b> 는 예외 대신 성공 여부(<code>bool</code>)를 돌려주므로, 실패하면 “다시 입력하세요” 라고 말하고 또 물어볼 수 있습니다. 이 일을 메서드 <code>ReadInt</code> 로 만들어 두면 국어 · 영어 · 수학 · 메뉴 번호 어디서나 재사용할 수 있습니다.' },
          { type: 'code', title: '예제 P1-2. 안전한 정수 입력 메서드 ReadInt', stdin: 'abc\n150\n90\n 85 \n', code: `using System;

class Program
{
    // min~max 사이의 올바른 정수를 입력할 때까지 반복해서 묻는다
    static int ReadInt(string prompt, int min, int max)
    {
        while (true)
        {
            Console.Write(prompt);
            string? line = Console.ReadLine();
            if (line == null) return min;          // 입력 끝(EOF) → 무한 반복 방지
            if (int.TryParse(line, out int value) && value >= min && value <= max)
                return value;
            Console.WriteLine($"  → {min}~{max} 사이의 정수를 입력하세요.");
        }
    }

    static void Main()
    {
        int kor = ReadInt("국어: ", 0, 100);
        int eng = ReadInt("영어: ", 0, 100);
        Console.WriteLine($"입력 완료: 국어 {kor}, 영어 {eng}");
    }
}`, expect: `국어:   → 0~100 사이의 정수를 입력하세요.
국어:   → 0~100 사이의 정수를 입력하세요.
국어: 영어: 입력 완료: 국어 90, 영어 85`, desc: '입력으로 <code>abc → 150 → 90 → " 85 "</code> 를 넣어 실행합니다. <code>abc</code> 는 <code>TryParse</code> 가 <code>false</code>, <code>150</code> 은 범위 밖이라 다시 묻습니다. <code>" 85 "</code> 처럼 앞뒤 공백은 <code>TryParse</code> 가 알아서 무시합니다. <code>while (true)</code> 안의 <code>return</code> 이 반복과 메서드를 함께 끝내는 구조를 눈여겨보세요. <code>Console.ReadLine()</code> 은 입력이 끝나면 <code>null</code> 을 돌려주므로, 그때도 빠져나오게 해 두어야 무한 반복을 막을 수 있습니다.' },
          { type: 'callout', kind: 'info', title: 'Parse 와 TryParse, 언제 무엇을?', html: '<code>int.Parse</code> 는 실패하면 <b>예외</b>를 던지고, <code>int.TryParse</code> 는 <b>false</b> 를 돌려줍니다. 사용자 입력처럼 <b>틀리는 것이 흔한</b> 경우에는 TryParse 가 알맞습니다. 예외는 “정말 예외적인” 상황(파일이 사라짐, 디스크 오류 등)에 씁니다.' },
          { type: 'h', text: '흐름 설계 — 메뉴 반복' },
          { type: 'p', html: '메뉴형 프로그램의 뼈대는 “<b>메뉴 출력 → 선택 입력 → 처리 → 다시 메뉴</b>”를 되풀이하는 <code>while (true)</code> 입니다. 선택 번호에 따라 할 일을 고르는 부분은 <code>switch</code> 가 잘 어울립니다. 메뉴 번호는 문자열 그대로 <code>case "1":</code> 처럼 비교하면 숫자 변환도 필요 없습니다.' },
          { type: 'figure', html: SVG_FLOW, caption: '메뉴 반복 흐름 — 입력이 끝났거나(null) "0" 이면 종료, 그 외에는 기능을 실행하고 메뉴로 돌아간다' },
          { type: 'code', title: '예제 P1-3. 메뉴 반복 뼈대', stdin: '1\n2\nx\n0\n', code: `using System;

class Program
{
    static void PrintMenu()
    {
        Console.WriteLine();
        Console.WriteLine("=== 성적 관리 프로그램 ===");
        Console.WriteLine("1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료");
        Console.Write("선택: ");
    }

    static void Main()
    {
        while (true)
        {
            PrintMenu();
            string? input = Console.ReadLine();
            if (input == null || input == "0")      // 입력 끝 또는 0 → 종료
            {
                Console.WriteLine("프로그램을 종료합니다.");
                break;
            }
            switch (input)
            {
                case "1": Console.WriteLine("[추가] 준비 중"); break;
                case "2": Console.WriteLine("[목록] 준비 중"); break;
                case "3": case "4": case "5": case "6": case "7": case "8":
                    Console.WriteLine($"[{input}번 기능] 준비 중");
                    break;
                default: Console.WriteLine("잘못된 선택입니다."); break;
            }
        }
    }
}`, expect: `
=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: [추가] 준비 중

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: [목록] 준비 중

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 잘못된 선택입니다.

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 프로그램을 종료합니다.`, desc: '입력 <code>1 → 2 → x → 0</code> 으로 실행한 결과입니다. 입력한 글자는 결과에 찍히지 않으므로 <code>선택: </code> 바로 뒤에 처리 결과가 붙습니다. 아직 기능은 “준비 중” 이지만 <b>메뉴 흐름은 완성</b>되었습니다. 앞으로 각 <code>case</code> 에 메서드 호출을 하나씩 채워 넣으면 됩니다. <code>case "3": case "4": …</code> 처럼 여러 case 를 붙여 쓰면 같은 코드를 공유합니다.' },
          { type: 'callout', kind: 'warn', title: 'C# 의 switch 는 fall-through 가 없다', html: 'C/C++ 에서는 <code>break</code> 를 빠뜨리면 아래 case 까지 이어서 실행되지만, C# 은 <b>컴파일 오류 CS0163</b>(“한 case 레이블에서 다른 case 레이블로 제어를 이동할 수 없습니다”)으로 막아 줍니다. 각 case 는 <code>break</code> · <code>return</code> 등으로 반드시 끝나야 합니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 프로젝트 만들기', html: '<b>새 프로젝트 만들기 → 콘솔 앱</b>(C#, .NET) 을 고르고 이름을 <code>GradeManager</code> 로 합니다. “최상위 문 사용 안 함(Do not use top-level statements)” 을 체크하면 이 강좌와 같은 <code>class Program { static void Main() … }</code> 형태로 만들어집니다. 단계마다 <b>Ctrl+F5</b>(디버그 없이 실행)로 확인하며 진행하세요.' },
          { type: 'h', text: '구현 계획 — 작게 만들고 자주 실행하기' },
          { type: 'p', html: '처음부터 200줄짜리 완성본을 한 번에 쓰면 오류가 수십 개 나고 어디부터 고쳐야 할지 알 수 없습니다. 대신 <b>작은 단계</b>로 나누어 단계마다 <b>빌드 → 실행 → 확인</b>합니다. 오류가 나도 “방금 추가한 부분”만 보면 되므로 훨씬 빨리 고칠 수 있습니다. 이런 방식을 <b>점진적 개발(incremental development)</b>이라고 합니다.' },
          { type: 'figure', html: SVG_PLAN, caption: '8단계 구현 계획 — 2교시에 단계 1~3, 3교시에 단계 4~6, 4교시에 단계 7~8 과 완성' },
          { type: 'table', head: ['단계', '목표', '확인 방법'], rows: [
            ['1', '<code>List&lt;Student&gt;</code> 에 추가하고 표로 출력', '입력한 학생이 표에 보이는가, 잘못된 점수를 다시 묻는가'],
            ['2', '메뉴 반복에 연결', '0 을 누를 때까지 반복하는가'],
            ['3', '이름 검색 (정확히 / 일부)', '없는 이름도 안전하게 처리하는가'],
            ['4', 'LINQ 통계', '평균 · 최고 · 최저 · 등급 분포가 맞는가'],
            ['5', '석차순 정렬과 석차', '동점자가 같은 석차인가, 원래 목록 순서는 그대로인가'],
            ['6', '확인 후 삭제', 'n 이면 취소되는가'],
            ['7 · 8', 'CSV 저장 · 불러오기', '저장 후 불러오면 그대로인가, 잘못된 줄을 건너뛰는가']
          ] },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 설계 문서', html: '실무에서는 요구사항 명세서, UML 클래스 다이어그램, 흐름도 등을 씁니다. 이번 시간에 만든 <b>기능 목록 표 · 클래스 그림 · 메뉴 흐름도 · 단계 계획표</b>가 바로 그 축소판입니다. 작은 프로그램이라도 10분 설계가 1시간 디버깅을 줄여 줍니다.' }
        ],
        practice: [
          {
            title: '실습 P1-1. 등급 메서드 경계값 테스트',
            level: 1,
            desc: '<p>평균을 받아 등급 문자열을 돌려주는 <code>static string GetGrade(double avg)</code> 를 <b>switch 식</b>으로 완성하세요. <code>Main</code> 은 경계값 배열을 돌며 <code>100 → A</code> 형식으로 출력합니다.</p><p>규칙: 90 이상 A, 80 이상 B, 70 이상 C, 60 이상 D, 그 외 F</p>',
            hint: '<code>avg switch { &gt;= 90 =&gt; "A", &gt;= 80 =&gt; "B", … , _ =&gt; "F" }</code> — 위에서부터 차례로 검사하므로 범위의 위쪽 끝은 쓰지 않아도 됩니다.',
            starter: `using System;

class Program
{
    static string GetGrade(double avg)
    {
        // TODO: switch 식으로 등급을 돌려주세요
        return "F";
    }

    static void Main()
    {
        double[] tests = { 100, 90, 89.9, 80, 79.5, 60, 59.9, 0 };
        foreach (double t in tests)
            Console.WriteLine($"{t} → {GetGrade(t)}");
    }
}
`,
            solution: `using System;

class Program
{
    static string GetGrade(double avg)
    {
        return avg switch
        {
            >= 90 => "A",
            >= 80 => "B",
            >= 70 => "C",
            >= 60 => "D",
            _ => "F"
        };
    }

    static void Main()
    {
        double[] tests = { 100, 90, 89.9, 80, 79.5, 60, 59.9, 0 };
        foreach (double t in tests)
            Console.WriteLine($"{t} → {GetGrade(t)}");
    }
}`,
            expect: `100 → A
90 → A
89.9 → B
80 → B
79.5 → C
60 → D
59.9 → F
0 → F`
          },
          {
            title: '실습 P1-2. 학생 한 명 입력받기',
            level: 2,
            desc: '<p><code>ReadName</code>(빈 이름이면 다시 묻기)과 <code>ReadInt</code>(0~100 이 아니면 다시 묻기)를 완성하고, 입력받은 값으로 <code>Student</code> 를 만들어 <code>이서연: 총점 216, 평균 72.0, 등급 C</code> 형식으로 출력하세요.</p><p>입력 예: 빈 줄 → <code>이서연</code> → <code>72</code> → <code>육십사</code> → <code>64</code> → <code>80</code></p>',
            hint: '<code>ReadName</code> 은 <code>Trim()</code> 한 결과가 <code>""</code> 이면 “  → 이름을 입력하세요.” 를 출력하고 다시 묻습니다. <code>ReadInt</code> 는 예제 P1-2 와 같습니다.',
            starter: `using System;

${CS_STUDENT}

class Program
{
    static int ReadInt(string prompt, int min, int max)
    {
        // TODO: 올바른 정수를 입력할 때까지 반복
        Console.Write(prompt);
        return int.Parse(Console.ReadLine() ?? "0");
    }

    static string ReadName(string prompt)
    {
        // TODO: 빈 이름이면 "  → 이름을 입력하세요." 출력 후 다시 묻기
        Console.Write(prompt);
        return Console.ReadLine() ?? "";
    }

    static void Main()
    {
        string name = ReadName("이름: ");
        int kor = ReadInt("국어: ", 0, 100);
        int eng = ReadInt("영어: ", 0, 100);
        int mat = ReadInt("수학: ", 0, 100);
        // TODO: Student 를 만들어 출력
        Console.WriteLine($"{name} {kor} {eng} {mat}");
    }
}
`,
            solution: `using System;

${CS_STUDENT}

class Program
{
${CS_READ}

    static void Main()
    {
        string name = ReadName("이름: ");
        int kor = ReadInt("국어: ", 0, 100);
        int eng = ReadInt("영어: ", 0, 100);
        int mat = ReadInt("수학: ", 0, 100);
        Student s = new Student(name, kor, eng, mat);
        Console.WriteLine($"{s.Name}: 총점 {s.Total}, 평균 {s.Average:F1}, 등급 {s.Grade}");
    }
}`,
            stdin: '\n이서연\n72\n육십사\n64\n80\n',
            expect: `이름:   → 이름을 입력하세요.
이름: 국어: 영어:   → 0~100 사이의 정수를 입력하세요.
영어: 수학: 이서연: 총점 216, 평균 72.0, 등급 C`
          }
        ],
        quiz: [
          { q: '다음 <code>Student</code> 의 <code>Total</code> 속성에 대한 설명으로 옳은 것은?<pre><code>public int Total =&gt; Kor + Eng + Mat;</code></pre>', options: ['생성자에서 한 번 계산해 저장된다', '읽을 때마다 현재 점수로 새로 계산된다', '값을 대입할 수 있다 (<code>s.Total = 300;</code>)', '정적(static) 속성이다'], answer: 1, explain: '<code>=&gt;</code> 로 만든 계산 속성은 get 만 있는 속성입니다. 읽을 때마다 식을 계산하므로 점수가 바뀌면 총점도 자동으로 바뀝니다. set 이 없으므로 대입은 컴파일 오류입니다.' },
          { q: '다음 코드의 출력은?<pre><code>bool ok = int.TryParse("12a", out int n);\nConsole.WriteLine($"{ok} {n}");</code></pre>', options: ['True 12', 'False 12', 'False 0', 'FormatException 발생'], answer: 2, explain: 'TryParse 는 실패해도 예외를 던지지 않고 false 를 돌려주며, out 변수에는 0 을 넣습니다.' },
          { q: '<code>int total = 250;</code> 일 때 <code>double avg = total / 3;</code> 의 값은?', options: ['83.333…', '83', '84', '컴파일 오류'], answer: 1, explain: 'int ÷ int 는 정수 나눗셈이라 83 이 되고, 그 값을 double 에 넣어도 83 입니다. <code>total / 3.0</code> 으로 써야 합니다.' },
          { q: 'C# 의 <code>switch</code> 문에서 <code>case "1":</code> 의 끝에 <code>break;</code> 를 빠뜨리고 바로 <code>case "2":</code> 를 쓰면?', options: ['case "2" 까지 이어서 실행된다', 'case "1" 만 실행된다', '컴파일 오류가 난다 (CS0163)', '실행 중 예외가 난다'], answer: 2, explain: 'C# 은 실수로 아래 case 로 넘어가는 fall-through 를 허용하지 않습니다. 코드가 있는 case 는 반드시 break · return 등으로 끝나야 합니다.' },
          { q: '<code>Console.ReadLine()</code> 이 <code>null</code> 을 돌려주는 경우는?', options: ['빈 줄(Enter 만)을 입력했을 때', '입력이 끝났을 때(EOF, 더 읽을 줄이 없음)', '숫자를 입력했을 때', '공백만 입력했을 때'], answer: 1, explain: '빈 줄은 <code>""</code>(빈 문자열)입니다. null 은 입력 스트림이 끝났을 때입니다. 메뉴 반복에서 null 을 확인하지 않으면 입력이 끝난 뒤 무한 반복에 빠질 수 있습니다.' }
        ],
        slides: [
          { layout: 'title', title: '요구사항 분석과 설계', subtitle: 'Project 01 · 콘솔 성적 관리 프로그램 — 1교시', badge: 'P01-1',
            notes: '<p><b>[도입 3분]</b> 4교시의 완성 프로그램을 먼저 실행해 시연합니다: 추가 → 목록 → 석차 → 통계 → 저장 → 삭제 → 불러오기. “오늘부터 4교시 동안 이걸 직접 만듭니다.”</p><p>발문: “이 프로그램에 지금까지 배운 것 중 무엇이 들어 있을까요?” → 반복문, 메서드, List, 클래스, TryParse, LINQ, 파일을 끌어냅니다.</p>' },
          { layout: 'bullets', title: '무엇을 만들까?', lead: '메뉴형 콘솔 성적 관리 프로그램',
            bullets: ['학생 추가: 이름 + 국 · 영 · 수 점수', '목록 · 석차순 보기 (표 출력)', '검색 · 통계(평균 · 최고 · 최저 · 등급 분포)', '확인 후 삭제', 'CSV 파일로 저장 · 불러오기', '<code>0</code> 을 누를 때까지 반복'],
            notes: '<p><b>[3분]</b> 칠판 한쪽에 기능 목록을 적어 두고 4교시 내내 체크해 나가면 진행 상황이 눈에 보입니다.</p><p>발문: “여러분이 선생님이라면 어떤 기능이 더 있으면 좋겠어요?” — 나온 아이디어(점수 수정, 과목 추가 등)는 4교시 확장 과제로 남겨 둡니다.</p>' },
          { layout: 'table', title: '요구사항 → 규칙으로', head: ['항목', '규칙'], rows: [['등급', '90↑A · 80↑B · 70↑C · 60↑D · 그 외 F'], ['석차', '총점 기준, 동점은 같은 석차 (1,2,2,4)'], ['출력', '평균 소수점 1자리, 열 정렬'], ['입력 오류', '숫자가 아니거나 0~100 밖이면 다시 입력'], ['파일', '잘못된 줄은 건너뛰고 개수 알림']],
            lead: '확인할 수 있게 써야 테스트할 수 있다',
            notes: '<p><b>[5분]</b> “입력을 잘 처리한다” 같은 모호한 요구사항과 비교합니다. 모호하면 완성 여부를 판단할 수 없습니다.</p><p>석차 규칙(1,2,2,4)을 미리 짚어 두면 3교시에 “1,2,2,3” 으로 구현하는 실수를 줄일 수 있습니다.</p>' },
          { layout: 'diagram', title: '클래스 설계 — 역할 나누기', html: SVG_DESIGN, caption: 'Student(데이터) · GradeBook(목록 관리) · Program(화면)',
            notes: '<p><b>[6분]</b> 왼쪽부터: Student 는 “한 명”, GradeBook 은 “여러 명”, Program 은 “사람과 대화”.</p><p>핵심 질문: “총점을 필드에 저장하면 어떤 문제가 생길까요?” → 점수를 고치고 총점을 다시 계산하는 것을 잊으면 값이 어긋난다 → 계산 속성.</p><p>GradeBook 은 4교시에 분리합니다. 처음부터 완벽한 구조보다 “일단 돌아가게 → 정리” 순서를 보여 주는 것이 목적입니다.</p>' },
          { layout: 'code', title: '예제 P1-1. 계산 속성', code: `using System;

class Student
{
    public string Name { get; }
    public int Kor { get; set; }
    public int Eng { get; set; }
    public int Mat { get; set; }
    public Student(string n, int k, int e, int m)
    { Name = n; Kor = k; Eng = e; Mat = m; }

    public int Total => Kor + Eng + Mat;
    public double Average => Total / 3.0;
    public string Grade => Average switch
    { >= 90 => "A", >= 80 => "B", >= 70 => "C", >= 60 => "D", _ => "F" };
}

class Program
{
    static void Main()
    {
        var s = new Student("김민준", 90, 85, 77);
        Console.WriteLine($"{s.Total} {s.Average:F1} {s.Grade}");
        s.Mat = 100;
        Console.WriteLine($"{s.Total} {s.Average:F1} {s.Grade}");
    }
}`, points: ['<code>{ get; }</code> 읽기 전용 · <code>{ get; set; }</code> 수정 가능', '<code>=&gt;</code> 계산 속성: 읽을 때마다 계산', '<code>3.0</code> 으로 나눠야 소수점 유지', 'switch 식 + 관계 패턴으로 등급'],
            notes: '<p><b>[5분]</b> 실행 후 <code>3.0</code> 을 <code>3</code> 으로 바꿔 보세요. 84.0 은 그대로라 차이가 안 보입니다. 두 번째 줄의 91.7 이 91.0 이 되는 것을 확인 → “버그가 안 보이는 데이터도 있다”.</p><p><code>s.Total = 300;</code> 을 넣어 컴파일 오류(CS0200)를 보여 주면 계산 속성이 읽기 전용임을 확실히 알 수 있습니다.</p>' },
          { layout: 'code', title: '예제 P1-2. 안전한 입력 ReadInt', stdin: 'abc\n150\n90\n', code: `using System;

class Program
{
    static int ReadInt(string prompt, int min, int max)
    {
        while (true)
        {
            Console.Write(prompt);
            string? line = Console.ReadLine();
            if (line == null) return min;
            if (int.TryParse(line, out int v) && v >= min && v <= max)
                return v;
            Console.WriteLine($"  → {min}~{max} 사이의 정수!");
        }
    }

    static void Main()
    {
        int kor = ReadInt("국어: ", 0, 100);
        Console.WriteLine($"국어 = {kor}");
    }
}`, points: ['TryParse: 실패해도 예외 없이 <code>false</code>', '범위 검사까지 한 조건에', '<code>while (true)</code> + <code>return</code>', '<code>null</code>(입력 끝) 대비'],
            notes: '<p><b>[5분]</b> 먼저 <code>int.Parse</code> 버전으로 abc 를 넣어 프로그램이 죽는 것을 보여 준 뒤, 이 코드로 바꿔 비교합니다.</p><p>발문: “이 메서드를 어디 어디서 쓸 수 있을까요?” → 국어 · 영어 · 수학, 상위 N명, 메뉴 번호 … 재사용이 메서드의 힘.</p>' },
          { layout: 'diagram', title: '메뉴 반복 흐름', html: SVG_FLOW, caption: '메뉴 → 입력 → 분기 → 다시 메뉴',
            notes: '<p><b>[3분]</b> 판단 마름모에 두 조건이 있음을 강조: <b>null(입력 끝)</b>과 <b>"0"</b>.</p><p>이 흐름은 P02 은행, P03 게임에서도 그대로 재사용되는 패턴입니다.</p>' },
          { layout: 'code', title: '예제 P1-3. 메뉴 반복 뼈대', stdin: '1\nx\n0\n', code: `using System;

class Program
{
    static void Main()
    {
        while (true)
        {
            Console.WriteLine("\\n1.추가 2.목록 0.종료");
            Console.Write("선택: ");
            string? input = Console.ReadLine();
            if (input == null || input == "0")
            {
                Console.WriteLine("종료합니다.");
                break;
            }
            switch (input)
            {
                case "1": Console.WriteLine("[추가] 준비 중"); break;
                case "2": Console.WriteLine("[목록] 준비 중"); break;
                default: Console.WriteLine("잘못된 선택"); break;
            }
        }
    }
}`, points: ['<code>while (true)</code> + <code>break</code>', '메뉴 번호를 문자열로 비교 — 변환 불필요', 'case 마다 <code>break</code> (없으면 CS0163)', '<code>default</code>: 그 밖의 입력'],
            notes: '<p><b>[5분]</b> 교사 화면에서 실행한 뒤 <code>case "1"</code> 의 <code>break</code> 를 지워 CS0163 오류를 보여 줍니다. C++ 을 배운 학생에게는 fall-through 와 비교해 주세요.</p>' },
          { layout: 'diagram', title: '구현 계획: 8단계', html: SVG_PLAN, caption: '작게 만들고 자주 실행하기',
            notes: '<p><b>[3분]</b> “200줄을 한 번에 쓰면 오류가 30개, 25줄씩 8번 쓰면 매번 1~2개.”</p><p>단계마다 <b>확인 방법</b>을 함께 정해 두면 학생들이 스스로 “다음 단계로 가도 되는지” 판단할 수 있습니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>int.TryParse("abc", out int n)</code> 의 반환값과 n 은?', options: ['true, 0', 'false, 0', 'false, -1', 'FormatException'], answer: 1, explain: '실패하면 false 를 돌려주고 out 변수에는 기본값 0 이 들어갑니다. 예외는 던지지 않습니다.',
            notes: '<p><b>[2분]</b> 4번을 고른 학생에게 “그건 누구의 동작일까요?” → int.Parse. 두 메서드의 차이를 한 번 더 정리합니다.</p>' },
          { layout: 'practice', title: '실습 P1-1. 등급 경계값 테스트', desc: '<code>GetGrade(double avg)</code> 를 switch 식으로 완성하고 100, 90, 89.9, 80, 79.5, 60, 59.9, 0 으로 테스트', starter: `using System;

class Program
{
    static string GetGrade(double avg)
    {
        // TODO: switch 식
        return "F";
    }

    static void Main()
    {
        double[] tests = { 100, 90, 89.9, 80, 79.5, 60, 59.9, 0 };
        foreach (double t in tests)
            Console.WriteLine($"{t} → {GetGrade(t)}");
    }
}`, solution: `using System;

class Program
{
    static string GetGrade(double avg) => avg switch
    {
        >= 90 => "A",
        >= 80 => "B",
        >= 70 => "C",
        >= 60 => "D",
        _ => "F"
    };

    static void Main()
    {
        double[] tests = { 100, 90, 89.9, 80, 79.5, 60, 59.9, 0 };
        foreach (double t in tests)
            Console.WriteLine($"{t} → {GetGrade(t)}");
    }
}`,
            notes: '<p><b>[실습 안내]</b> 경계값(90, 89.9, 60, 59.9)을 고르는 이유를 먼저 묻습니다. 끝나면 실습 P1-2(입력 메서드 두 개)로 넘어가게 합니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['요구사항 = 기능 목록 + 확인할 수 있는 규칙', 'Student(데이터) · GradeBook(목록) · Program(화면)', '총점 · 평균 · 등급은 계산 속성 <code>=&gt;</code>', '입력은 <code>TryParse</code> + 범위 검사 + 다시 묻기', '메뉴 = <code>while (true)</code> + <code>switch</code> + null/0 이면 종료', '작게 만들고 자주 실행하기 (점진적 개발)'],
            notes: '<p>다음 시간: 단계 1~3 — List 에 학생을 추가하고, 표로 출력하고, 이름으로 찾기. 오늘 만든 Student · ReadInt · 메뉴 뼈대를 그대로 씁니다.</p>' }
        ]
      },

      /* =========================================================== 2교시 */
      {
        id: 'p01-2',
        title: '단계별 구현 ① — 추가 · 목록 · 검색',
        minutes: 50,
        goals: [
          'List<Student> 에 학생을 추가하고 형식 지정으로 가지런한 표를 출력할 수 있다',
          '메뉴 반복의 각 case 에 기능 메서드를 연결할 수 있다',
          'Find · Any · Where 와 람다식으로 학생을 찾고, 찾지 못한 경우(null)를 안전하게 처리할 수 있다'
        ],
        flow: [['복습 · 목표', 3], ['단계 1: 추가 · 표 출력', 15], ['단계 2: 메뉴 연결', 10], ['단계 3: 검색', 12], ['실습 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '단계 1. 학생을 List 에 담고 표로 출력하기' },
          { type: 'p', html: '학생이 몇 명일지 미리 알 수 없으므로 크기가 고정된 배열 대신 <b><code>List&lt;Student&gt;</code></b> 를 씁니다(7장). 목록은 여러 메서드(추가 · 출력 · 검색 …)가 함께 써야 하므로 <code>Program</code> 클래스의 <b><code>static</code> 필드</b>로 둡니다. (4교시에 <code>GradeBook</code> 클래스로 옮깁니다.)' },
          { type: 'p', html: '표를 가지런히 출력할 때는 10장의 <b>형식 지정 <code>{값,폭}</code></b>을 씁니다. 폭이 양수면 오른쪽 정렬(숫자), 음수면 왼쪽 정렬(이름)입니다. <code>{s.Average,7:F1}</code> 은 “폭 7칸, 소수점 1자리” 입니다.' },
          { type: 'code', title: '단계 1. List 에 학생 추가하고 표로 출력하기', stdin: '김민준\n90\n85\n77\n이서연\n72\n육십사\n64\n80\n', code: `using System;
using System.Collections.Generic;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_READ}

    static void AddStudent()
    {
        string name = ReadName("이름: ");
        int kor = ReadInt("국어: ", 0, 100);
        int eng = ReadInt("영어: ", 0, 100);
        int mat = ReadInt("수학: ", 0, 100);
        students.Add(new Student(name, kor, eng, mat));
        Console.WriteLine($"{name} 추가 완료 (현재 {students.Count}명)");
    }

${CS_LIST}

    static void Main()
    {
        PrintList();          // 아직 0명
        AddStudent();
        AddStudent();
        PrintList();
    }
}`, expect: `등록된 학생이 없습니다.
이름: 국어: 영어: 수학: 김민준 추가 완료 (현재 1명)
이름: 국어: 영어:   → 0~100 사이의 정수를 입력하세요.
영어: 수학: 이서연 추가 완료 (현재 2명)
번호 이름      국어 영어 수학  총점   평균 등급
----------------------------------------------
  1  김민준      90   85   77   252   84.0   B
  2  이서연      72   64   80   216   72.0   C`, desc: '<code>AddStudent</code> 는 1교시의 <code>ReadName</code> · <code>ReadInt</code> 로 값을 받아 <code>new Student(…)</code> 를 만들고 <code>students.Add</code> 로 목록 끝에 넣습니다. <code>PrintList</code> 는 목록이 비었으면 안내만 하고 <code>return</code> 으로 일찍 끝냅니다(<b>조기 반환</b>). <code>new string(\'-\', 46)</code> 은 <code>-</code> 46개로 된 문자열입니다.' },
          { type: 'callout', kind: 'tip', title: '한글 이름과 열 맞추기', html: '콘솔 글꼴에서 한글 한 글자는 영문 두 글자 너비로 보이는 경우가 많아, 이름 길이가 제각각이면 열이 조금 어긋날 수 있습니다. 이 프로젝트는 세 글자 이름을 쓰고, 이름 열은 <b>왼쪽 정렬</b>, 숫자 열은 <b>오른쪽 정렬</b>로 맞춥니다. 정확히 맞추고 싶다면 글자 폭을 계산해 공백을 채우는 메서드를 따로 만들어야 합니다(확장 과제).' },
          { type: 'callout', kind: 'info', title: '왜 static 필드일까?', html: '<code>Main</code> 은 <code>static</code> 메서드라서 객체 없이 실행됩니다. <code>Main</code> 이 부르는 <code>AddStudent</code> · <code>PrintList</code> 도 <code>static</code> 이고, 이들이 함께 쓰는 <code>students</code> 도 <code>static</code> 이어야 합니다. 지역 변수로 만들어 매개변수로 넘기는 방법도 있지만, 기능이 많아지면 매번 넘기기 번거롭습니다. 4교시에는 목록을 가진 <b>객체</b>(<code>GradeBook</code>)를 만들어 이 문제를 깔끔하게 풉니다.' },
          { type: 'h', text: '단계 2. 메뉴에 연결하기' },
          { type: 'p', html: '1교시의 메뉴 뼈대에서 “준비 중” 자리에 <code>AddStudent()</code> 와 <code>PrintList()</code> 호출을 넣습니다. 이제 원하는 만큼 학생을 추가하고 언제든 목록을 볼 수 있습니다. 같은 이름을 두 번 추가하지 못하게 <b><code>Any</code></b>(조건을 만족하는 요소가 하나라도 있나?)로 먼저 확인합니다.' },
          { type: 'code', title: '단계 2. 메뉴에 추가 · 목록 연결하기', stdin: '2\n1\n김민준\n90\n85\n77\n1\n김민준\n1\n이서연\n72\n64\n80\n2\n0\n', code: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_READ}

    static void AddStudent()
    {
        string name = ReadName("이름: ");
        if (students.Any(s => s.Name == name))       // 같은 이름이 이미 있나?
        {
            Console.WriteLine($"{name} 학생은 이미 등록되어 있습니다.");
            return;
        }
        int kor = ReadInt("국어: ", 0, 100);
        int eng = ReadInt("영어: ", 0, 100);
        int mat = ReadInt("수학: ", 0, 100);
        students.Add(new Student(name, kor, eng, mat));
        Console.WriteLine($"{name} 추가 완료 (현재 {students.Count}명)");
    }

${CS_LIST}

    static void Main()
    {
        while (true)
        {
            Console.WriteLine();
            Console.WriteLine("=== 성적 관리 프로그램 ===");
            Console.WriteLine("1.추가 2.목록 0.종료");
            Console.Write("선택: ");
            string? input = Console.ReadLine();
            if (input == null || input == "0") { Console.WriteLine("프로그램을 종료합니다."); break; }
            switch (input)
            {
                case "1": AddStudent(); break;
                case "2": PrintList(); break;
                default: Console.WriteLine("잘못된 선택입니다."); break;
            }
        }
    }
}`, expect: `
=== 성적 관리 프로그램 ===
1.추가 2.목록 0.종료
선택: 등록된 학생이 없습니다.

=== 성적 관리 프로그램 ===
1.추가 2.목록 0.종료
선택: 이름: 국어: 영어: 수학: 김민준 추가 완료 (현재 1명)

=== 성적 관리 프로그램 ===
1.추가 2.목록 0.종료
선택: 이름: 김민준 학생은 이미 등록되어 있습니다.

=== 성적 관리 프로그램 ===
1.추가 2.목록 0.종료
선택: 이름: 국어: 영어: 수학: 이서연 추가 완료 (현재 2명)

=== 성적 관리 프로그램 ===
1.추가 2.목록 0.종료
선택: 번호 이름      국어 영어 수학  총점   평균 등급
----------------------------------------------
  1  김민준      90   85   77   252   84.0   B
  2  이서연      72   64   80   216   72.0   C

=== 성적 관리 프로그램 ===
1.추가 2.목록 0.종료
선택: 프로그램을 종료합니다.`, desc: '입력: 목록(빈 상태) → 김민준 추가 → 김민준 다시 추가(거절) → 이서연 추가 → 목록 → 종료. <code>students.Any(s =&gt; s.Name == name)</code> 는 “이름이 같은 학생이 하나라도 있는가” 를 <code>bool</code> 로 돌려줍니다. 11장의 람다식 <code>s =&gt; 조건</code> 을 “학생 s 를 받아 조건을 검사하는 작은 메서드” 로 읽으세요.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 입력 흐름 따라가기', html: '<code>AddStudent</code> 의 첫 줄 왼쪽 여백을 클릭해 <b>중단점(F9)</b>을 걸고 <b>F5</b> 로 실행한 뒤 메뉴에서 1 을 고르면 그 줄에서 멈춥니다. <b>F10</b>(프로시저 단위 실행)으로 한 줄씩 넘기며 <b>지역</b> 창에서 <code>name</code> · <code>kor</code> 값이 채워지는 모습과 <code>students</code> 의 <code>Count</code> 가 늘어나는 것을 확인하세요.' },
          { type: 'h', text: '단계 3. 이름으로 검색하기' },
          { type: 'p', html: '검색은 두 가지를 지원합니다. <b>정확히 같은 이름</b>이면 그 학생 한 명을, 아니면 <b>이름에 검색어가 들어간</b> 학생을 모두 보여 줍니다.' },
          { type: 'table', head: ['메서드', '돌려주는 것', '못 찾으면'], rows: [
            ['<code>students.Find(s =&gt; s.Name == key)</code>', '조건에 맞는 <b>첫 번째</b> 학생 (List 메서드)', '<code>null</code>'],
            ['<code>students.FirstOrDefault(s =&gt; …)</code>', '첫 번째 학생 (LINQ, 모든 컬렉션)', '<code>null</code>'],
            ['<code>students.FindIndex(s =&gt; …)</code>', '첫 번째 학생의 <b>위치</b>', '<code>-1</code>'],
            ['<code>students.Any(s =&gt; …)</code>', '하나라도 있는가 (<code>bool</code>)', '<code>false</code>'],
            ['<code>students.Where(s =&gt; …).ToList()</code>', '조건에 맞는 <b>모든</b> 학생', '빈 목록 (Count 0)']
          ] },
          { type: 'code', title: '단계 3. 정확히 · 일부 이름으로 검색하기', stdin: '박지호\n준\n홍길동\n\n', code: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

    static void Search()
    {
        Console.Write("검색할 이름(일부도 가능): ");
        string key = (Console.ReadLine() ?? "").Trim();
        if (key == "") { Console.WriteLine("검색어가 비었습니다."); return; }

        Student? exact = students.Find(s => s.Name == key);       // 정확히 같은 이름
        if (exact != null)
        {
            Console.WriteLine($"찾음: {exact.Name} 국어 {exact.Kor}, 영어 {exact.Eng}, 수학 {exact.Mat} → 평균 {exact.Average:F1} ({exact.Grade})");
            return;
        }

        List<Student> found = students.Where(s => s.Name.Contains(key)).ToList();   // 일부 일치
        if (found.Count == 0)
        {
            Console.WriteLine($"'{key}' 학생이 없습니다.");
            return;
        }
        Console.WriteLine($"'{key}' 가 들어간 학생 {found.Count}명:");
        foreach (Student s in found)
            Console.WriteLine($"  {s.Name} 평균 {s.Average:F1} ({s.Grade})");
    }

    static void Main()
    {
        AddSample();                       // 연습용 학생 5명
        for (int i = 0; i < 4; i++)
            Search();
    }
}`, expect: `검색할 이름(일부도 가능): 찾음: 박지호 국어 95, 영어 92, 수학 98 → 평균 95.0 (A)
검색할 이름(일부도 가능): '준' 가 들어간 학생 2명:
  김민준 평균 84.0 (B)
  정하준 평균 84.0 (B)
검색할 이름(일부도 가능): '홍길동' 학생이 없습니다.
검색할 이름(일부도 가능): 검색어가 비었습니다.`, desc: '<code>AddSample</code> 은 매번 입력하지 않도록 연습용 학생 5명을 넣어 주는 메서드입니다(개발 중에만 쓰는 <b>테스트 데이터</b>). <code>Find</code> 는 못 찾으면 <code>null</code> 을 돌려주므로 반드시 <code>if (exact != null)</code> 로 확인한 뒤 멤버를 써야 합니다. 확인하지 않고 <code>exact.Name</code> 을 읽으면 <b>NullReferenceException</b> 입니다. <code>Student?</code> 의 <code>?</code> 는 “null 일 수 있음” 을 뜻하는 표시입니다.' },
          { type: 'callout', kind: 'warn', title: '흔한 실수: 대소문자 · 공백', html: '사용자가 <code>" 박지호"</code> 처럼 앞에 공백을 넣으면 <code>==</code> 비교는 실패합니다. 입력은 <code>Trim()</code> 해서 비교하세요. 영문 이름이라면 <code>string.Equals(a, b, StringComparison.OrdinalIgnoreCase)</code> 나 <code>Contains(key, StringComparison.OrdinalIgnoreCase)</code> 로 대소문자를 무시할 수 있습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: ?. 와 ?? 연산자', html: '<code>exact?.Name</code> 은 <code>exact</code> 가 null 이면 예외 대신 <code>null</code> 을 돌려줍니다. <code>exact?.Name ?? "(없음)"</code> 처럼 <code>??</code> 와 함께 쓰면 “없으면 기본값” 을 한 줄로 쓸 수 있습니다. 이 예제의 <code>Console.ReadLine() ?? ""</code> 도 같은 원리로, 입력이 끝나 null 이 오면 빈 문자열로 바꿉니다.' }
        ],
        practice: [
          {
            title: '실습 P1-3. 점수 수정 기능',
            level: 2,
            desc: '<p>이름으로 학생을 찾아 세 과목 점수를 새로 입력받는 <code>EditScores()</code> 를 완성하세요. 없는 이름이면 <code>\'홍길동\' 학생이 없습니다.</code> 를 출력합니다. 고친 뒤에는 <code>박지호: 총점 285 → 270, 등급 A → A</code> 형식으로 바뀐 결과를 보여 줍니다.</p><p>총점 · 등급이 계산 속성이라 점수만 바꾸면 자동으로 바뀌는 것을 확인하세요.</p>',
            hint: '<code>Student? s = students.Find(x =&gt; x.Name == name);</code> → null 확인 → 고치기 전 <code>s.Total</code> · <code>s.Grade</code> 를 변수에 저장 → <code>s.Kor = ReadInt(…)</code> …',
            starter: `using System;
using System.Collections.Generic;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

${CS_READ}

    static void EditScores()
    {
        string name = ReadName("수정할 이름: ");
        // TODO: Find 로 찾기 → 없으면 안내
        // TODO: 점수 세 개 다시 입력 → 바뀐 총점 · 등급 출력
        Console.WriteLine($"{name}: 아직 구현하지 않았습니다.");
    }

    static void Main()
    {
        AddSample();
        EditScores();
        EditScores();
    }
}
`,
            solution: `using System;
using System.Collections.Generic;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

${CS_READ}

    static void EditScores()
    {
        string name = ReadName("수정할 이름: ");
        Student? s = students.Find(x => x.Name == name);
        if (s == null)
        {
            Console.WriteLine($"'{name}' 학생이 없습니다.");
            return;
        }
        int oldTotal = s.Total;
        string oldGrade = s.Grade;
        s.Kor = ReadInt("국어: ", 0, 100);
        s.Eng = ReadInt("영어: ", 0, 100);
        s.Mat = ReadInt("수학: ", 0, 100);
        Console.WriteLine($"{s.Name}: 총점 {oldTotal} → {s.Total}, 등급 {oldGrade} → {s.Grade}");
    }

    static void Main()
    {
        AddSample();
        EditScores();
        EditScores();
    }
}`,
            stdin: '홍길동\n최유나\n78\n80\n75\n',
            expect: `수정할 이름: '홍길동' 학생이 없습니다.
수정할 이름: 국어: 영어: 수학: 최유나: 총점 189 → 233, 등급 D → C`
          },
          {
            title: '실습 P1-4. 조건으로 찾기 — 과목 만점자 · 낙제 과목',
            level: 2,
            desc: '<p>연습용 학생 5명에서 다음을 LINQ 로 찾아 출력하세요.</p><ol><li>수학 90점 이상인 학생 이름 (<code>Where</code> + <code>Select</code>, 쉼표로 이어서)</li><li>60점 미만 과목이 하나라도 있는 학생이 있는가? (<code>Any</code>)</li><li>모든 학생의 영어가 60점 이상인가? (<code>All</code>)</li><li>평균 80 이상인 학생 수 (<code>Count</code>)</li></ol>',
            hint: '<code>string.Join(", ", students.Where(s =&gt; s.Mat &gt;= 90).Select(s =&gt; s.Name))</code>',
            starter: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

    static void Main()
    {
        AddSample();
        // TODO: 1) 수학 90 이상 이름
        // TODO: 2) 60 미만 과목이 있는 학생이 있나? (Any)
        // TODO: 3) 모두 영어 60 이상? (All)
        // TODO: 4) 평균 80 이상 인원 (Count)
        Console.WriteLine($"학생 수: {students.Count}");
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

    static void Main()
    {
        AddSample();
        string math90 = string.Join(", ", students.Where(s => s.Mat >= 90).Select(s => s.Name));
        Console.WriteLine($"수학 90점 이상: {math90}");

        bool anyFail = students.Any(s => s.Kor < 60 || s.Eng < 60 || s.Mat < 60);
        Console.WriteLine($"60점 미만 과목이 있는 학생이 있나? {anyFail}");

        bool allEng = students.All(s => s.Eng >= 60);
        Console.WriteLine($"모두 영어 60점 이상인가? {allEng}");

        int over80 = students.Count(s => s.Average >= 80);
        Console.WriteLine($"평균 80점 이상: {over80}명");
    }
}`,
            expect: `수학 90점 이상: 박지호
60점 미만 과목이 있는 학생이 있나? True
모두 영어 60점 이상인가? True
평균 80점 이상: 3명`
          }
        ],
        quiz: [
          { q: '<code>students.Find(s =&gt; s.Name == "홍길동")</code> 에서 그런 학생이 없으면?', options: ['예외가 발생한다', '<code>null</code> 을 돌려준다', '<code>-1</code> 을 돌려준다', '빈 Student 객체를 돌려준다'], answer: 1, explain: 'Find · FirstOrDefault 는 못 찾으면 null(참조 형식의 기본값)입니다. 위치를 돌려주는 FindIndex 가 -1 입니다.' },
          { q: '<code>{s.Name,-6}</code> 형식 지정의 의미는?', options: ['6글자로 자른다', '폭 6칸, 오른쪽 정렬', '폭 6칸, 왼쪽 정렬', '앞에서 6글자를 뺀다'], answer: 2, explain: '폭이 음수면 왼쪽 정렬(뒤를 공백으로 채움), 양수면 오른쪽 정렬입니다. 폭보다 길면 자르지 않고 그대로 출력합니다.' },
          { q: '다음 코드의 출력은?<pre><code>var names = new List&lt;string&gt; { "김민준", "정하준", "이서연" };\nConsole.WriteLine(names.Where(n =&gt; n.Contains("준")).Count());</code></pre>', options: ['0', '1', '2', '3'], answer: 2, explain: '"준" 이 들어간 이름은 김민준, 정하준 두 개입니다. <code>names.Count(n =&gt; n.Contains("준"))</code> 로 줄여 쓸 수도 있습니다.' },
          { q: '같은 이름의 학생이 이미 있는지 <code>bool</code> 로 확인하기에 가장 알맞은 것은?', options: ['<code>students.Any(s =&gt; s.Name == name)</code>', '<code>students.Where(s =&gt; s.Name == name)</code>', '<code>students.Contains(name)</code>', '<code>students.Find(name)</code>'], answer: 0, explain: 'Any 는 조건을 만족하는 요소가 하나라도 있으면 true 입니다. Where 는 목록을 돌려주고, Contains(name) 은 string 을 Student 목록에서 찾으므로 컴파일 오류입니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ① — 추가 · 목록 · 검색', subtitle: 'Project 01 · 콘솔 성적 관리 프로그램 — 2교시', badge: 'P01-2',
            notes: '<p><b>[복습 3분]</b> 1교시의 Student · ReadInt · 메뉴 뼈대를 화면에 띄우고 “오늘은 이 뼈대에 살을 붙입니다.” 단계 계획표에서 1~3단계를 가리킵니다.</p>' },
          { layout: 'bullets', title: '단계 1 — 학생 목록 만들기', lead: '몇 명일지 모른다 → List&lt;Student&gt;',
            bullets: ['<code>static List&lt;Student&gt; students = new List&lt;Student&gt;();</code>', '추가: <code>students.Add(new Student(…))</code>', '인원: <code>students.Count</code> · i번째: <code>students[i]</code>', '여러 메서드가 함께 쓰므로 <code>static</code> 필드', '4교시에 GradeBook 클래스로 옮길 예정'],
            notes: '<p><b>[3분]</b> 배열로는 왜 안 될까? → 크기를 미리 정해야 한다. List 는 필요할 때마다 늘어난다(7장 복습).</p>' },
          { layout: 'code', title: '단계 1. 추가와 표 출력', stdin: '김민준\n90\n85\n77\n', code: `using System;
using System.Collections.Generic;

class Student
{
    public string Name; public int Kor, Eng, Mat;
    public int Total => Kor + Eng + Mat;
    public double Average => Total / 3.0;
}

class Program
{
    static List<Student> students = new List<Student>();

    static int ReadInt(string p)
    { Console.Write(p); return int.TryParse(Console.ReadLine(), out int v) ? v : 0; }

    static void Main()
    {
        Console.Write("이름: ");
        var s = new Student { Name = Console.ReadLine() ?? "" };
        s.Kor = ReadInt("국어: "); s.Eng = ReadInt("영어: "); s.Mat = ReadInt("수학: ");
        students.Add(s);
        Console.WriteLine("\\n번호 이름   국어 영어 수학  총점   평균");
        foreach (Student t in students)
            Console.WriteLine($"{students.IndexOf(t) + 1,3}  {t.Name,-5}{t.Kor,4}{t.Eng,5}{t.Mat,5}{t.Total,6}{t.Average,7:F1}");
    }
}`, points: ['<code>students.Add(…)</code> 로 목록 끝에 추가', '<code>{값,폭}</code>: 양수 오른쪽 · 음수 왼쪽 정렬', '<code>{값,7:F1}</code>: 폭 7, 소수 1자리', '슬라이드용 축약판 — 본문은 ReadInt 검증 포함'],
            notes: '<p><b>[8분]</b> 폭 숫자를 바꿔 가며 표가 어떻게 달라지는지 보여 줍니다. <code>-5</code> 를 <code>5</code> 로 바꾸면 이름이 오른쪽으로 붙습니다.</p><p>이 슬라이드는 공간 때문에 필드와 객체 초기화자를 썼습니다. 본문 단계 1 은 1교시의 Student(속성 + 생성자)와 ReadInt(다시 묻기)를 그대로 씁니다.</p>' },
          { layout: 'bullets', title: '단계 2 — 메뉴에 연결', lead: '“준비 중” 자리에 메서드 호출을 넣는다',
            bullets: ['<code>case "1": AddStudent(); break;</code>', '<code>case "2": PrintList(); break;</code>', '빈 목록이면 안내 후 <code>return</code> (조기 반환)', '중복 이름: <code>students.Any(s =&gt; s.Name == name)</code>'],
            notes: '<p><b>[4분]</b> 조기 반환(early return)은 “예외 상황을 먼저 처리하고 빠져나가는” 습관입니다. if-else 가 깊게 중첩되는 것을 막아 줍니다.</p>' },
          { layout: 'code', title: '단계 2. 중복 이름 막기 (Any)', stdin: '김민준\n김민준\n', code: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static List<string> names = new List<string>();

    static void Add()
    {
        Console.Write("이름: ");
        string name = (Console.ReadLine() ?? "").Trim();
        if (names.Any(n => n == name))
        {
            Console.WriteLine($"{name} 은(는) 이미 있습니다.");
            return;                      // 조기 반환
        }
        names.Add(name);
        Console.WriteLine($"{name} 추가 (현재 {names.Count}명)");
    }

    static void Main()
    {
        Add();
        Add();
    }
}`, points: ['<code>Any(조건)</code>: 하나라도 있으면 true', '람다 <code>n =&gt; n == name</code>', '문제가 있으면 먼저 <code>return</code>'],
            notes: '<p><b>[4분]</b> 같은 이름을 두 번 넣어 거절되는 것을 확인. 발문: “이름이 같은 학생이 실제로 있다면?” → 학번 같은 고유 번호(ID)를 두는 것이 실무 방식이라는 것을 소개합니다.</p>' },
          { layout: 'table', title: '단계 3 — 찾기 메서드 비교', head: ['메서드', '결과', '못 찾으면'], rows: [['<code>Find(조건)</code>', '첫 번째 요소', '<code>null</code>'], ['<code>FirstOrDefault(조건)</code>', '첫 번째 요소 (LINQ)', '<code>null</code>'], ['<code>FindIndex(조건)</code>', '위치', '<code>-1</code>'], ['<code>Any(조건)</code>', 'bool', '<code>false</code>'], ['<code>Where(조건).ToList()</code>', '모든 요소', '빈 목록']],
            lead: '못 찾았을 때 무엇을 돌려주는지가 가장 중요하다',
            notes: '<p><b>[4분]</b> “못 찾으면” 열을 가리고 학생들에게 맞혀 보게 합니다. null 을 확인하지 않으면 NullReferenceException — 초보자 오류 1순위.</p>' },
          { layout: 'code', title: '단계 3. 정확히 / 일부 검색', stdin: '박지호\n준\n', code: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static List<string> names = new List<string> { "김민준", "이서연", "박지호", "정하준" };

    static void Search()
    {
        Console.Write("검색: ");
        string key = (Console.ReadLine() ?? "").Trim();
        string? exact = names.Find(n => n == key);
        if (exact != null)
        {
            Console.WriteLine($"찾음: {exact}");
            return;
        }
        var found = names.Where(n => n.Contains(key)).ToList();
        Console.WriteLine(found.Count == 0 ? "없음" : $"{found.Count}명: {string.Join(", ", found)}");
    }

    static void Main()
    {
        Search();
        Search();
    }
}`, points: ['<code>Find</code> → null 확인 필수', '<code>Where(…Contains…)</code>: 부분 일치', '<code>string.Join</code> 으로 이어 출력'],
            notes: '<p><b>[5분]</b> 교사 화면에서 stdin 을 바꿔 “홍”, “” 등을 넣어 봅니다. 빈 문자열은 모든 문자열에 Contains 되므로 전원이 검색됩니다 → 그래서 본문 예제는 빈 검색어를 먼저 거릅니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>Student? s = students.Find(…);</code> 다음에 바로 <code>s.Name</code> 을 쓰면 위험한 이유는?', options: ['Find 는 항상 예외를 던진다', '못 찾으면 s 가 null 이라 NullReferenceException', 'Name 은 private 이다', 'Find 는 목록을 돌려준다'], answer: 1, explain: '찾지 못하면 null 이 들어갑니다. <code>if (s != null)</code> 로 확인한 뒤 사용하세요.',
            notes: '<p><b>[2분]</b> Visual Studio 는 이런 코드에 초록 물결선(null 가능성 경고)을 표시해 줍니다. 경고를 무시하지 않는 습관을 강조하세요.</p>' },
          { layout: 'practice', title: '실습 P1-3. 점수 수정 기능', desc: '이름으로 찾아 점수 3개를 다시 입력받고 <code>최유나: 총점 189 → 233, 등급 D → C</code> 출력. 없는 이름은 안내', starter: `using System;
using System.Collections.Generic;

class Student
{
    public string Name = ""; public int Kor, Eng, Mat;
    public int Total => Kor + Eng + Mat;
}

class Program
{
    static List<Student> students = new List<Student>
    {
        new Student { Name = "최유나", Kor = 58, Eng = 70, Mat = 61 }
    };

    static void Main()
    {
        Console.Write("수정할 이름: ");
        string name = Console.ReadLine() ?? "";
        // TODO: Find → null 확인 → 점수 다시 입력 → 결과 출력
        Console.WriteLine(name);
    }
}`, solution: `using System;
using System.Collections.Generic;

class Student
{
    public string Name = ""; public int Kor, Eng, Mat;
    public int Total => Kor + Eng + Mat;
}

class Program
{
    static List<Student> students = new List<Student>
    {
        new Student { Name = "최유나", Kor = 58, Eng = 70, Mat = 61 }
    };

    static int ReadInt(string p)
    { Console.Write(p); return int.TryParse(Console.ReadLine(), out int v) ? v : 0; }

    static void Main()
    {
        Console.Write("수정할 이름: ");
        string name = Console.ReadLine() ?? "";
        Student? s = students.Find(x => x.Name == name);
        if (s == null) { Console.WriteLine("없는 학생입니다."); return; }
        int old = s.Total;
        s.Kor = ReadInt("국어: "); s.Eng = ReadInt("영어: "); s.Mat = ReadInt("수학: ");
        Console.WriteLine($"{s.Name}: 총점 {old} → {s.Total}");
    }
}`, stdin: '최유나\n78\n80\n75\n',
            notes: '<p><b>[실습 안내]</b> 고치기 <b>전</b> 값을 변수에 저장해 두어야 “→” 앞뒤를 보여 줄 수 있다는 점이 포인트입니다. 빨리 끝난 학생은 실습 P1-4(LINQ 조건 찾기)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>List&lt;Student&gt;</code> + <code>Add</code> · <code>Count</code> · <code>[i]</code>', '표 출력: <code>{값,폭}</code> · <code>{값,폭:F1}</code>', '메뉴 case 에 메서드 호출 연결, 조기 반환', '<code>Any</code> 로 중복 확인, <code>Find</code> 는 null 확인', '<code>Where(…).ToList()</code> 로 여러 명 찾기'],
            notes: '<p>다음 시간: 단계 4~6 — LINQ 통계, 석차순 정렬, 삭제. AddSample 테스트 데이터를 계속 씁니다.</p>' }
        ]
      },

      /* =========================================================== 3교시 */
      {
        id: 'p01-3',
        title: '단계별 구현 ② — 통계 · 석차 · 삭제',
        minutes: 50,
        goals: [
          'LINQ 집계 메서드(Average · Max · Min · Count · MaxBy)와 GroupBy 로 통계를 낼 수 있다',
          'OrderByDescending · ThenBy 로 원본을 바꾸지 않고 석차순 목록을 만들고, 동점을 고려한 석차를 계산할 수 있다',
          'FindIndex · RemoveAt · RemoveAll 로 학생을 안전하게 삭제하고, foreach 중 삭제가 왜 안 되는지 설명할 수 있다'
        ],
        flow: [['복습 · 목표', 3], ['단계 4: 통계', 14], ['단계 5: 석차 정렬', 14], ['단계 6: 삭제', 9], ['실습 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '단계 4. LINQ 로 통계 내기' },
          { type: 'p', html: '반복문으로 합계를 구하고 최댓값을 찾는 코드를 직접 쓸 수도 있지만, 11장의 <b>LINQ 집계 메서드</b>를 쓰면 한 줄로 끝납니다. 괄호 안의 람다식 <code>s =&gt; s.Kor</code> 는 “학생마다 무엇을 기준으로 계산할지” 를 알려 줍니다.' },
          { type: 'table', head: ['메서드', '의미', '예'], rows: [
            ['<code>Average(s =&gt; s.Kor)</code>', '평균 (<code>double</code>)', '국어 평균'],
            ['<code>Max(…)</code> / <code>Min(…)</code>', '최댓값 / 최솟값', '국어 최고점'],
            ['<code>Count(조건)</code>', '조건을 만족하는 개수', '<code>Count(s =&gt; s.Grade == "A")</code>'],
            ['<code>MaxBy(s =&gt; s.Total)</code>', '기준이 가장 큰 <b>요소 자체</b>', '총점 1등 학생 객체'],
            ['<code>GroupBy(s =&gt; s.Grade)</code>', '기준이 같은 것끼리 묶기', '등급별 묶음 → <code>g.Key</code>, <code>g.Count()</code>']
          ] },
          { type: 'p', html: '국어 · 영어 · 수학 세 과목에 똑같은 통계를 내야 하므로, “어느 과목 점수를 쓸지” 를 <b><code>Func&lt;Student, int&gt;</code></b>(학생을 받아 int 를 돌려주는 메서드) 매개변수로 받는 메서드 하나를 만듭니다. 11장의 델리게이트를 실전에서 쓰는 장면입니다.' },
          { type: 'code', title: '단계 4. 과목별 통계 · 최우수 · 등급 분포', code: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

    // score: 학생에서 어떤 점수를 꺼낼지 알려 주는 메서드 (람다로 전달)
    static void PrintSubject(string title, Func<Student, int> score)
    {
        Console.WriteLine($"{title}  평균 {students.Average(score),5:F1}  최고 {students.Max(score),3}  최저 {students.Min(score),3}");
    }

    static void PrintStats()
    {
        if (students.Count == 0) { Console.WriteLine("등록된 학생이 없습니다."); return; }
        Console.WriteLine($"학생 수: {students.Count}명, 반 평균: {students.Average(s => s.Average):F1}");
        PrintSubject("국어", s => s.Kor);
        PrintSubject("영어", s => s.Eng);
        PrintSubject("수학", s => s.Mat);

        Student best = students.MaxBy(s => s.Total)!;          // 총점이 가장 큰 학생
        Console.WriteLine($"최우수: {best.Name} (총점 {best.Total})");

        var grades = students.GroupBy(s => s.Grade)             // 등급별로 묶어
                             .OrderBy(g => g.Key)               // A, B, C … 순서로
                             .Select(g => $"{g.Key} {g.Count()}명");
        Console.WriteLine("등급 분포: " + string.Join(", ", grades));
    }

    static void Main()
    {
        PrintStats();          // 0명일 때
        AddSample();
        PrintStats();
    }
}`, expect: `등록된 학생이 없습니다.
학생 수: 5명, 반 평균: 79.6
국어  평균  80.0  최고  95  최저  58
영어  평균  78.2  최고  92  최저  64
수학  평균  80.6  최고  98  최저  61
최우수: 박지호 (총점 285)
등급 분포: A 1명, B 2명, C 1명, D 1명`, desc: '<code>PrintSubject("국어", s =&gt; s.Kor)</code> 를 부르면 메서드 안의 <code>score</code> 가 “국어 점수를 꺼내는 메서드” 가 되어 <code>students.Average(score)</code> 가 국어 평균이 됩니다. <code>MaxBy</code> 는 최댓값(285)이 아니라 <b>그 값을 가진 학생</b>을 돌려줍니다. 목록이 비면 <code>null</code> 이 될 수 있다고 컴파일러가 알려 주므로, 앞에서 0명을 거른 뒤 <code>!</code>(null 아님 표시)를 붙였습니다.' },
          { type: 'callout', kind: 'warn', title: '빈 목록에 Average · Max 를 쓰면 예외', html: '학생이 0명일 때 <code>students.Average(s =&gt; s.Kor)</code> 는 <b>InvalidOperationException</b>(“Sequence contains no elements”)을 던집니다. 평균을 낼 값이 없기 때문입니다. 통계 · 석차처럼 집계를 쓰는 메서드는 맨 앞에서 <code>Count == 0</code> 을 먼저 확인하세요. 예제의 첫 <code>PrintStats()</code> 호출이 바로 그 확인입니다.' },
          { type: 'h', text: '단계 5. 석차순 정렬과 석차 계산' },
          { type: 'p', html: '<code>students.Sort(…)</code> 는 목록 <b>자체의 순서를 바꿉니다</b>. 그러면 “2. 목록(입력순)” 이 석차순으로 바뀌어 버립니다. LINQ 의 <b><code>OrderByDescending</code></b> 은 원본은 그대로 두고 <b>정렬된 새 시퀀스</b>를 돌려주므로, 보기용 정렬에 알맞습니다. 총점이 같으면 <code>ThenBy</code> 로 이름순을 두 번째 기준으로 줍니다.' },
          { type: 'p', html: '석차는 “<b>나보다 총점이 높은 학생 수 + 1</b>” 입니다. 이렇게 세면 동점자는 자동으로 같은 석차가 되고, 그다음 학생은 건너뛴 석차(1, 2, 2, <b>4</b>)가 됩니다.' },
          { type: 'figure', html: SVG_RANK, caption: '석차순 정렬 — OrderByDescending(총점) → ThenBy(이름) 으로 새 목록을 만들고, 석차는 “나보다 높은 사람 수 + 1”' },
          { type: 'code', title: '단계 5. 석차순 보기 (원본 순서는 그대로)', code: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

    static int RankOf(Student s) => students.Count(o => o.Total > s.Total) + 1;

    static void PrintRanking()
    {
        if (students.Count == 0) { Console.WriteLine("등록된 학생이 없습니다."); return; }
        List<Student> ranked = students.OrderByDescending(s => s.Total)   // 총점 내림차순
                                       .ThenBy(s => s.Name)              // 동점이면 이름순
                                       .ToList();
        Console.WriteLine("석차 이름      총점   평균 등급");
        Console.WriteLine(new string('-', 31));
        foreach (Student s in ranked)
            Console.WriteLine($"{RankOf(s),3}  {s.Name,-6}{s.Total,5}{s.Average,7:F1}{s.Grade,4}");
    }

    static void Main()
    {
        AddSample();
        PrintRanking();
        Console.WriteLine("원래 목록 순서: " + string.Join(", ", students.Select(s => s.Name)));
    }
}`, expect: `석차 이름      총점   평균 등급
-------------------------------
  1  박지호     285   95.0   A
  2  김민준     252   84.0   B
  2  정하준     252   84.0   B
  4  이서연     216   72.0   C
  5  최유나     189   63.0   D
원래 목록 순서: 김민준, 이서연, 박지호, 최유나, 정하준`, desc: '김민준과 정하준은 총점이 252 로 같아 둘 다 2등이고, <code>ThenBy(s =&gt; s.Name)</code> 때문에 이름순(김 → 정)으로 나옵니다. 이서연은 자기보다 높은 학생이 3명이라 4등입니다. 마지막 줄에서 원본 <code>students</code> 의 순서가 바뀌지 않은 것을 확인하세요.' },
          { type: 'callout', kind: 'info', title: 'Sort 와 OrderBy 의 차이', html: '<code>students.Sort((a, b) =&gt; b.Total.CompareTo(a.Total));</code> 는 <b>원본을 제자리에서</b> 정렬하고 반환값이 없습니다(<code>void</code>). <code>students.OrderByDescending(s =&gt; s.Total)</code> 는 원본을 두고 <b>새 시퀀스</b>를 돌려줍니다. “보여 주기만 하는 정렬” 은 OrderBy, “목록 순서를 정말 바꾸는 정렬” 은 Sort 를 쓰세요.' },
          { type: 'h', text: '단계 6. 확인 후 삭제하기' },
          { type: 'p', html: '삭제는 되돌릴 수 없으므로 <b>한 번 더 묻습니다</b>. 이름으로 위치를 찾고(<code>FindIndex</code>, 없으면 -1), <code>y</code> 를 입력했을 때만 <code>RemoveAt(위치)</code> 로 지웁니다. 조건에 맞는 학생을 한꺼번에 지울 때는 <code>RemoveAll(조건)</code> 이 지운 개수를 돌려줍니다.' },
          { type: 'code', title: '단계 6. 확인 후 삭제 · 조건으로 한꺼번에 삭제', stdin: '홍길동\n최유나\nn\n최유나\nY\n', code: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

    static void Delete()
    {
        Console.Write("삭제할 이름: ");
        string name = (Console.ReadLine() ?? "").Trim();
        int index = students.FindIndex(s => s.Name == name);
        if (index < 0) { Console.WriteLine($"'{name}' 학생이 없습니다."); return; }

        Console.Write($"{name} 학생을 삭제할까요? (y/n): ");
        string answer = (Console.ReadLine() ?? "").Trim().ToLower();
        if (answer == "y")
        {
            students.RemoveAt(index);
            Console.WriteLine($"삭제했습니다. (남은 학생 {students.Count}명)");
        }
        else
            Console.WriteLine("취소했습니다.");
    }

    static void Main()
    {
        AddSample();
        Delete();       // 없는 이름
        Delete();       // n → 취소
        Delete();       // Y → 삭제 (대소문자 무시)
        Console.WriteLine("남은 학생: " + string.Join(", ", students.Select(s => s.Name)));

        int removed = students.RemoveAll(s => s.Average < 75);   // 평균 75 미만 모두 삭제
        Console.WriteLine($"평균 75 미만 {removed}명 삭제 → 남은 학생: " + string.Join(", ", students.Select(s => s.Name)));
    }
}`, expect: `삭제할 이름: '홍길동' 학생이 없습니다.
삭제할 이름: 최유나 학생을 삭제할까요? (y/n): 취소했습니다.
삭제할 이름: 최유나 학생을 삭제할까요? (y/n): 삭제했습니다. (남은 학생 4명)
남은 학생: 김민준, 이서연, 박지호, 정하준
평균 75 미만 1명 삭제 → 남은 학생: 김민준, 박지호, 정하준`, desc: '<code>ToLower()</code> 로 바꾼 뒤 비교하므로 <code>Y</code> 도 <code>y</code> 로 인정됩니다. <code>RemoveAt</code> 은 위치로, <code>Remove(객체)</code> 는 객체로, <code>RemoveAll(조건)</code> 은 조건으로 지웁니다.' },
          { type: 'code', title: '추가 예제. foreach 안에서 지우면? — RemoveAll 을 쓰는 이유', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<int> scores = new List<int> { 90, 55, 72, 40, 88 };
        try
        {
            foreach (int s in scores)
                if (s < 60) scores.Remove(s);          // 반복 중에 목록을 바꾼다!
        }
        catch (InvalidOperationException ex)
        {
            Console.WriteLine($"오류: {ex.GetType().Name}");
        }
        Console.WriteLine(string.Join(", ", scores));   // 55 만 지워지고 멈췄다

        scores.RemoveAll(s => s < 60);                 // 안전한 방법
        Console.WriteLine(string.Join(", ", scores));
    }
}`, expect: `오류: InvalidOperationException
90, 72, 40, 88
90, 72, 88`, desc: '<code>foreach</code> 로 목록을 돌고 있는 도중에 <code>Remove</code> 로 목록을 바꾸면, 다음 요소로 넘어갈 때 <b>InvalidOperationException</b>(컬렉션이 수정됨)이 납니다. 조건으로 지울 때는 <code>RemoveAll</code> 을 쓰거나, <code>for</code> 문을 <b>뒤에서부터</b>(<code>i = Count - 1</code> → 0) 돌며 <code>RemoveAt(i)</code> 하세요.' }
        ],
        practice: [
          {
            title: '실습 P1-5. 상위 N명 보기',
            level: 2,
            desc: '<p><code>ReadInt</code> 로 N(1~학생 수)을 입력받아 총점 상위 N명을 <code>1등 박지호 285</code> 형식으로 출력하세요. 동점이면 이름순이고, 석차는 “나보다 높은 사람 수 + 1” 입니다.</p><p>입력 예: <code>0</code> (범위 밖) → <code>3</code></p>',
            hint: '<code>students.OrderByDescending(s =&gt; s.Total).ThenBy(s =&gt; s.Name).Take(n)</code>',
            starter: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

${CS_READ}

    static void Main()
    {
        AddSample();
        int n = ReadInt($"몇 명까지 볼까요? (1~{students.Count}): ", 1, students.Count);
        // TODO: 상위 n 명을 석차와 함께 출력
        Console.WriteLine($"n = {n}");
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

${CS_READ}

    static void Main()
    {
        AddSample();
        int n = ReadInt($"몇 명까지 볼까요? (1~{students.Count}): ", 1, students.Count);
        var top = students.OrderByDescending(s => s.Total).ThenBy(s => s.Name).Take(n);
        foreach (Student s in top)
        {
            int rank = students.Count(o => o.Total > s.Total) + 1;
            Console.WriteLine($"{rank}등 {s.Name} {s.Total}");
        }
    }
}`,
            stdin: '0\n3\n',
            expect: `몇 명까지 볼까요? (1~5):   → 1~5 사이의 정수를 입력하세요.
몇 명까지 볼까요? (1~5): 1등 박지호 285
2등 김민준 252
2등 정하준 252`
          },
          {
            title: '실습 P1-6. 반 평균보다 낮은 학생 · 과목별 1등',
            level: 3,
            desc: '<p>다음 두 가지를 출력하세요.</p><ol><li>반 평균(학생 평균들의 평균)보다 평균이 낮은 학생: <code>반 평균 79.6 미만: 이서연(72.0), 최유나(63.0)</code></li><li>과목별 1등: <code>국어 1등: 박지호 95</code> … — <code>MaxBy</code> 와 <code>Func&lt;Student, int&gt;</code> 를 받는 메서드 <code>PrintTop</code> 을 만들어 세 번 호출</li></ol>',
            hint: '<code>double classAvg = students.Average(s =&gt; s.Average);</code> → <code>Where(s =&gt; s.Average &lt; classAvg)</code>. <code>PrintTop("국어", s =&gt; s.Kor)</code> 안에서 <code>students.MaxBy(score)!</code>',
            starter: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

    static void PrintTop(string title, Func<Student, int> score)
    {
        // TODO: MaxBy 로 1등 학생을 찾아 "국어 1등: 박지호 95" 출력
        Console.WriteLine(title);
    }

    static void Main()
    {
        AddSample();
        // TODO: 반 평균 미만 학생
        PrintTop("국어", s => s.Kor);
        PrintTop("영어", s => s.Eng);
        PrintTop("수학", s => s.Mat);
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

    static void PrintTop(string title, Func<Student, int> score)
    {
        Student top = students.MaxBy(score)!;
        Console.WriteLine($"{title} 1등: {top.Name} {score(top)}");
    }

    static void Main()
    {
        AddSample();
        double classAvg = students.Average(s => s.Average);
        var low = students.Where(s => s.Average < classAvg).Select(s => $"{s.Name}({s.Average:F1})");
        Console.WriteLine($"반 평균 {classAvg:F1} 미만: {string.Join(", ", low)}");

        PrintTop("국어", s => s.Kor);
        PrintTop("영어", s => s.Eng);
        PrintTop("수학", s => s.Mat);
    }
}`,
            expect: `반 평균 79.6 미만: 이서연(72.0), 최유나(63.0)
국어 1등: 박지호 95
영어 1등: 박지호 92
수학 1등: 박지호 98`
          }
        ],
        quiz: [
          { q: '다음 코드의 출력은?<pre><code>var totals = new List&lt;int&gt; { 252, 216, 285, 252 };\nvar s = totals.OrderByDescending(t =&gt; t).ToList();\nConsole.WriteLine($"{s[0]} {totals[0]}");</code></pre>', options: ['285 285', '285 252', '252 252', '216 252'], answer: 1, explain: 'OrderByDescending 은 정렬된 새 목록을 만들고 원본 totals 는 그대로입니다. s[0] 은 285, totals[0] 은 252.' },
          { q: '총점이 [285, 252, 252, 216] 일 때 “나보다 높은 사람 수 + 1” 로 구한 216 의 석차는?', options: ['2', '3', '4', '5'], answer: 2, explain: '216 보다 높은 사람이 3명(285, 252, 252)이므로 3 + 1 = 4등입니다. 동점 뒤는 석차를 건너뜁니다.' },
          { q: '학생이 0명인 <code>List&lt;Student&gt;</code> 에서 <code>students.Average(s =&gt; s.Kor)</code> 를 호출하면?', options: ['0 을 돌려준다', 'NaN 을 돌려준다', 'InvalidOperationException 이 발생한다', 'null 을 돌려준다'], answer: 2, explain: '평균을 낼 요소가 없으므로 예외입니다. 집계 전에 Count == 0 을 먼저 확인합니다.' },
          { q: '<code>foreach (var s in list) if (s &lt; 60) list.Remove(s);</code> 의 문제와 올바른 대안은?', options: ['문제없다', '반복 중 목록 수정으로 예외 → <code>list.RemoveAll(s =&gt; s &lt; 60)</code>', '컴파일 오류 → <code>list.Delete(s)</code>', '첫 요소만 지워진다 → <code>list.Clear()</code>'], answer: 1, explain: 'foreach 로 열거하는 동안 컬렉션을 바꾸면 InvalidOperationException 입니다. RemoveAll 이나 뒤에서부터 도는 for 문을 씁니다.' },
          { q: '<code>students.MaxBy(s =&gt; s.Total)</code> 가 돌려주는 것은?', options: ['가장 큰 총점(int)', '총점이 가장 큰 학생(Student)', '총점 순으로 정렬된 목록', '가장 큰 총점의 위치'], answer: 1, explain: 'Max 는 값(285)을, MaxBy 는 그 값을 가진 요소(학생 객체)를 돌려줍니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ② — 통계 · 석차 · 삭제', subtitle: 'Project 01 · 콘솔 성적 관리 프로그램 — 3교시', badge: 'P01-3',
            notes: '<p><b>[복습 3분]</b> 2교시 결과(추가 · 목록 · 검색이 되는 메뉴)를 실행해 보여 줍니다. 오늘은 LINQ 를 본격적으로 씁니다 — 11장 LINQ 표를 잠깐 띄워 두면 좋습니다.</p>' },
          { layout: 'table', title: '단계 4 — LINQ 집계 메서드', head: ['메서드', '결과'], rows: [['<code>Average(s =&gt; s.Kor)</code>', '평균 (double)'], ['<code>Max</code> / <code>Min</code>', '최댓값 / 최솟값'], ['<code>Count(조건)</code>', '조건 만족 개수'], ['<code>MaxBy(s =&gt; s.Total)</code>', '가장 큰 <b>요소</b>'], ['<code>GroupBy(s =&gt; s.Grade)</code>', '같은 등급끼리 묶음']],
            lead: '반복문 10줄 → LINQ 1줄',
            notes: '<p><b>[4분]</b> 먼저 칠판에 for 문으로 국어 평균 · 최고점을 구하는 코드를 쓰고, 같은 일을 LINQ 한 줄로 바꿔 보여 줍니다. “무엇을” 원하는지만 쓰고 “어떻게” 는 LINQ 에 맡긴다.</p>' },
          { layout: 'code', title: '단계 4. Func 로 과목 고르기', code: `using System;
using System.Collections.Generic;
using System.Linq;

record Student(string Name, int Kor, int Eng, int Mat);

class Program
{
    static List<Student> students = new List<Student>
    {
        new("김민준", 90, 85, 77), new("이서연", 72, 64, 80),
        new("박지호", 95, 92, 98), new("최유나", 58, 70, 61)
    };

    static void PrintSubject(string title, Func<Student, int> score)
    {
        Console.WriteLine($"{title} 평균 {students.Average(score):F1}, " +
                          $"최고 {students.Max(score)}, 최저 {students.Min(score)}");
    }

    static void Main()
    {
        PrintSubject("국어", s => s.Kor);
        PrintSubject("영어", s => s.Eng);
        PrintSubject("수학", s => s.Mat);
        var best = students.MaxBy(s => s.Kor + s.Eng + s.Mat)!;
        Console.WriteLine($"최우수: {best.Name}");
    }
}`, points: ['<code>Func&lt;Student, int&gt;</code>: 학생 → 점수', '같은 코드를 세 과목에 재사용', '<code>MaxBy</code> 는 학생 객체를 돌려준다', '슬라이드용으로 record 사용 (12장)'],
            notes: '<p><b>[6분]</b> 공간을 줄이려고 12장의 <code>record</code> 로 Student 를 한 줄로 썼다고 알려 주세요. 본문 예제는 계산 속성이 있는 class 입니다.</p><p>발문: “과학 과목이 추가되면 몇 줄을 바꿔야 할까요?” → 한 줄 추가.</p>' },
          { layout: 'code', title: '단계 4. GroupBy — 등급 분포', code: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        string[] grades = { "B", "C", "A", "D", "B" };

        var groups = grades.GroupBy(g => g)       // 같은 등급끼리
                           .OrderBy(g => g.Key);  // A, B, C, D 순
        foreach (var g in groups)
            Console.WriteLine($"{g.Key}: {g.Count()}명 {new string('*', g.Count())}");
    }
}`, points: ['<code>g.Key</code>: 묶은 기준 값', '<code>g.Count()</code>: 그 묶음의 개수', '<code>new string(\'*\', n)</code> 으로 막대그래프'],
            notes: '<p><b>[4분]</b> 막대그래프 출력은 학생들이 좋아합니다. 실제 예제에서는 <code>students.GroupBy(s =&gt; s.Grade)</code> 로 같은 일을 한다고 연결하세요.</p>' },
          { layout: 'diagram', title: '단계 5 — 석차순 정렬과 석차', html: SVG_RANK, caption: '원본은 그대로, 정렬된 새 목록 · 석차 = 나보다 높은 사람 수 + 1',
            notes: '<p><b>[5분]</b> Sort 로 원본을 정렬하면 “2. 목록(입력순)” 도 바뀌어 버린다는 문제를 먼저 제기합니다. 그래서 OrderBy.</p><p>석차 공식을 칠판에 쓰고 동점 예(252, 252)를 학생에게 계산시키세요.</p>' },
          { layout: 'code', title: '단계 5. OrderByDescending · ThenBy', code: `using System;
using System.Collections.Generic;
using System.Linq;

record Student(string Name, int Total);

class Program
{
    static void Main()
    {
        var students = new List<Student>
        {
            new("김민준", 252), new("이서연", 216), new("박지호", 285),
            new("최유나", 189), new("정하준", 252)
        };
        var ranked = students.OrderByDescending(s => s.Total)
                             .ThenBy(s => s.Name).ToList();
        foreach (var s in ranked)
        {
            int rank = students.Count(o => o.Total > s.Total) + 1;
            Console.WriteLine($"{rank}등 {s.Name} {s.Total}");
        }
        Console.WriteLine("원본: " + string.Join(", ", students.Select(s => s.Name)));
    }
}`, points: ['<code>OrderByDescending</code>: 내림차순 새 시퀀스', '<code>ThenBy</code>: 동점일 때 두 번째 기준', '<code>Count(o =&gt; o.Total &gt; s.Total) + 1</code>', '원본 순서 유지 확인'],
            notes: '<p><b>[5분]</b> <code>ThenBy</code> 를 지우고 실행해 보세요. 동점자 순서가 입력순(김민준, 정하준)이 됩니다. 이번 데이터에서는 우연히 같아서 차이가 없다는 것도 알려 주세요 — 테스트 데이터를 고르는 것도 기술입니다.</p>' },
          { layout: 'bullets', title: '단계 6 — 확인 후 삭제', lead: '되돌릴 수 없는 작업은 한 번 더 묻는다',
            bullets: ['<code>FindIndex(조건)</code> → 없으면 -1', '<code>(y/n)</code> 확인 — <code>ToLower()</code> 로 Y 도 허용', '<code>RemoveAt(위치)</code> · <code>Remove(객체)</code>', '<code>RemoveAll(조건)</code> → 지운 개수', ['foreach 안에서 Remove 금지', ['InvalidOperationException — RemoveAll 이나 뒤에서부터 for']]],
            notes: '<p><b>[4분]</b> 추가 예제(foreach 중 삭제)를 실행해 예외를 직접 보여 줍니다. 55 만 지워지고 40 은 남는 결과를 보고 “왜 40 은 안 지워졌을까?” 를 물어보세요.</p>' },
          { layout: 'code', title: '단계 6. 삭제 확인', stdin: '최유나\nY\n', code: `using System;
using System.Collections.Generic;

class Program
{
    static List<string> names = new List<string> { "김민준", "최유나", "정하준" };

    static void Main()
    {
        Console.Write("삭제할 이름: ");
        string name = (Console.ReadLine() ?? "").Trim();
        int index = names.FindIndex(n => n == name);
        if (index < 0) { Console.WriteLine("없는 학생"); return; }

        Console.Write($"{name} 삭제? (y/n): ");
        if ((Console.ReadLine() ?? "").Trim().ToLower() == "y")
        {
            names.RemoveAt(index);
            Console.WriteLine("삭제 완료: " + string.Join(", ", names));
        }
        else Console.WriteLine("취소");
    }
}`, points: ['없으면 먼저 안내하고 return', '확인 입력은 Trim + ToLower', '<code>RemoveAt(index)</code>'],
            notes: '<p><b>[3분]</b> stdin 을 <code>최유나 n</code>, <code>홍길동</code> 으로 바꿔 세 경로를 모두 확인합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '총점 [285, 252, 252, 216, 189] 에서 189 의 석차는?', options: ['3', '4', '5', '6'], answer: 2, explain: '189 보다 높은 사람이 4명이므로 4 + 1 = 5등.',
            notes: '<p><b>[2분]</b> 4 를 고른 학생은 “동점을 한 명으로 센” 것입니다. 공식대로 세면 자연히 5.</p>' },
          { layout: 'practice', title: '실습 P1-5. 상위 N명', desc: 'N 을 입력받아 총점 상위 N명을 <code>1등 박지호 285</code> 형식으로 (동점은 같은 석차, 이름순)', starter: `using System;
using System.Collections.Generic;
using System.Linq;

record Student(string Name, int Total);

class Program
{
    static void Main()
    {
        var students = new List<Student>
        {
            new("김민준", 252), new("이서연", 216), new("박지호", 285),
            new("최유나", 189), new("정하준", 252)
        };
        Console.Write("N: ");
        int n = int.TryParse(Console.ReadLine(), out int v) ? v : 1;
        // TODO: OrderByDescending → ThenBy → Take(n)
        Console.WriteLine(n);
    }
}`, solution: `using System;
using System.Collections.Generic;
using System.Linq;

record Student(string Name, int Total);

class Program
{
    static void Main()
    {
        var students = new List<Student>
        {
            new("김민준", 252), new("이서연", 216), new("박지호", 285),
            new("최유나", 189), new("정하준", 252)
        };
        Console.Write("N: ");
        int n = int.TryParse(Console.ReadLine(), out int v) ? v : 1;
        foreach (var s in students.OrderByDescending(s => s.Total).ThenBy(s => s.Name).Take(n))
            Console.WriteLine($"{students.Count(o => o.Total > s.Total) + 1}등 {s.Name} {s.Total}");
    }
}`, stdin: '3\n',
            notes: '<p><b>[실습 안내]</b> 본문 실습은 1교시 ReadInt 로 범위(1~학생 수)를 검사합니다. Take(n) 은 n 이 개수보다 커도 예외 없이 있는 만큼만 돌려준다는 것도 확인해 보게 하세요.</p>' },
          { layout: 'summary', title: '정리', bullets: ['집계: <code>Average</code> · <code>Max</code> · <code>Min</code> · <code>Count</code> · <code>MaxBy</code>', '<code>Func&lt;Student, int&gt;</code> 로 과목 고르기 → 코드 재사용', '<code>GroupBy</code> → <code>g.Key</code>, <code>g.Count()</code>', '보기용 정렬은 <code>OrderByDescending</code> + <code>ThenBy</code> (원본 유지)', '석차 = 나보다 높은 사람 수 + 1', '삭제는 확인 후 <code>RemoveAt</code>, 조건 삭제는 <code>RemoveAll</code>'],
            notes: '<p>다음 시간: CSV 저장 · 불러오기, 클래스 파일 분리, 완성 프로그램 테스트, 확장 과제.</p>' }
        ]
      },

      /* =========================================================== 4교시 */
      {
        id: 'p01-4',
        title: '완성과 확장',
        minutes: 50,
        goals: [
          'File.WriteAllLines 와 LINQ Select 로 학생 목록을 CSV 파일에 저장할 수 있다',
          'File.ReadAllLines · Split · int.TryParse 로 CSV 를 읽고, 잘못된 줄을 건너뛰며 안전하게 불러올 수 있다',
          '완성 프로그램을 Student · GradeBook · Program 클래스(파일)로 나누고 테스트 시나리오로 확인할 수 있다',
          '완성 프로그램에 새 기능을 추가하는 확장 과제를 설계 · 구현할 수 있다'
        ],
        flow: [['복습 · 목표', 3], ['단계 7: CSV 저장', 8], ['단계 8: 불러오기', 10], ['완성 · 파일 분리', 12], ['테스트 · 확장 과제', 12], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '단계 7. CSV 파일로 저장하기' },
          { type: 'p', html: '지금까지 입력한 학생들은 프로그램을 끄면 모두 사라집니다. 변수는 <b>메모리</b>에 있기 때문입니다. 데이터를 남기려면 <b>파일</b>에 써야 합니다. 가장 간단한 형식은 한 줄에 한 명씩, 값을 쉼표로 구분하는 <b>CSV(Comma-Separated Values)</b> 입니다. 메모장이나 엑셀로 열어 볼 수도 있습니다.' },
          { type: 'figure', html: SVG_CSV, caption: '저장: 학생 → CSV 한 줄(ToCsv) → WriteAllLines / 불러오기: ReadAllLines → Split · TryParse → 학생' },
          { type: 'p', html: '학생 한 명을 CSV 한 줄로 바꾸는 일은 <code>Student</code> 가 가장 잘 알므로 <code>ToCsv()</code> 메서드를 <code>Student</code> 에 둡니다. 목록 전체는 LINQ <code>Select</code> 로 “학생마다 한 줄” 로 바꾼 뒤 <code>File.WriteAllLines</code> 한 번으로 씁니다. 총점 · 평균 · 등급은 점수로 다시 계산할 수 있으므로 저장하지 않습니다.' },
          { type: 'code', title: '단계 7. 학생 목록을 CSV 로 저장하기', code: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class Student
{
    public string Name { get; }
    public int Kor { get; set; }
    public int Eng { get; set; }
    public int Mat { get; set; }
    public Student(string name, int kor, int eng, int mat) { Name = name; Kor = kor; Eng = eng; Mat = mat; }

    public string ToCsv() => $"{Name},{Kor},{Eng},{Mat}";     // 학생 → CSV 한 줄
}

class Program
{
    const string FileName = "grades.csv";
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

    static void Save()
    {
        IEnumerable<string> lines = students.Select(s => s.ToCsv());   // 학생마다 한 줄
        File.WriteAllLines(FileName, lines);                             // 있으면 덮어쓴다
        Console.WriteLine($"{FileName} 에 {students.Count}명을 저장했습니다.");
    }

    static void Main()
    {
        AddSample();
        Save();
        Console.WriteLine("--- 파일 내용 ---");
        Console.Write(File.ReadAllText(FileName));
    }
}`, expect: `grades.csv 에 5명을 저장했습니다.
--- 파일 내용 ---
김민준,90,85,77
이서연,72,64,80
박지호,95,92,98
최유나,58,70,61
정하준,85,80,87`, desc: '<code>File.WriteAllLines(경로, 문자열 목록)</code> 은 항목마다 줄을 바꿔 쓰고, 파일이 이미 있으면 <b>덮어씁니다</b>. 경로에 이름만 쓰면 <b>현재 작업 폴더</b>에 만들어집니다(이 웹 강좌에서는 브라우저 안의 작업 폴더). 확인을 위해 <code>File.ReadAllText</code> 로 파일 전체를 다시 읽어 출력했습니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 저장된 파일 찾기', html: 'Visual Studio 에서 실행하면 파일은 실행 파일 옆, 즉 <code>프로젝트 폴더\\bin\\Debug\\net9.0\\grades.csv</code> 에 생깁니다. <b>솔루션 탐색기</b>에서 프로젝트를 오른쪽 클릭 → <b>파일 탐색기에서 폴더 열기</b>로 이동해 메모장으로 열어 보세요. 엑셀로 열 때 한글이 깨지면 <code>File.WriteAllLines(FileName, lines, new UTF8Encoding(true))</code> 처럼 BOM 이 있는 UTF-8 로 저장합니다.' },
          { type: 'callout', kind: 'warn', title: '이름에 쉼표가 들어가면?', html: '<code>"김,민준"</code> 이라는 이름을 저장하면 <code>김,민준,90,85,77</code> 이 되어 값이 5개로 쪼개집니다. 그래서 완성 프로그램은 이름에 쉼표가 있으면 추가를 거절합니다. 실무 CSV 는 값을 큰따옴표로 감싸는 규칙이 있지만, 이 프로젝트에서는 입력 단계에서 막는 방법을 씁니다.' },
          { type: 'h', text: '단계 8. CSV 불러오기 — 파일은 언제든 망가져 있을 수 있다' },
          { type: 'p', html: '파일은 사람이 메모장으로 고칠 수도 있고, 저장 도중 끊겨 망가질 수도 있습니다. 그래서 불러오기는 <b>한 줄씩 검사</b>하며 올바른 줄만 받아들이고, 잘못된 줄은 <b>건너뛴 뒤 몇 줄인지 알려</b> 줍니다. “CSV 한 줄 → 학생” 변환은 <code>Student.FromCsv</code> 라는 <b>정적 메서드</b>로 만들고, 형식이 틀리면 <code>null</code> 을 돌려주게 합니다.' },
          { type: 'code', title: '단계 8. 잘못된 줄을 건너뛰며 CSV 불러오기', code: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class Student
{
    public string Name { get; }
    public int Kor { get; set; }
    public int Eng { get; set; }
    public int Mat { get; set; }
    public Student(string name, int kor, int eng, int mat) { Name = name; Kor = kor; Eng = eng; Mat = mat; }
    public double Average => (Kor + Eng + Mat) / 3.0;

    public static bool IsScore(int n) => n >= 0 && n <= 100;

    // CSV 한 줄 → Student. 형식이 틀리면 null
    public static Student? FromCsv(string line)
    {
        string[] p = line.Split(',');
        if (p.Length != 4 || p[0].Trim() == "") return null;
        if (!int.TryParse(p[1], out int kor) || !int.TryParse(p[2], out int eng) || !int.TryParse(p[3], out int mat))
            return null;
        if (!IsScore(kor) || !IsScore(eng) || !IsScore(mat)) return null;
        return new Student(p[0].Trim(), kor, eng, mat);
    }
}

class Program
{
    static List<Student> students = new List<Student>();

    static void Load(string path)
    {
        if (!File.Exists(path)) { Console.WriteLine($"{path} 파일이 없습니다."); return; }
        string[] lines = File.ReadAllLines(path);
        var loaded = new List<Student>();
        int skipped = 0;
        for (int i = 0; i < lines.Length; i++)
        {
            if (string.IsNullOrWhiteSpace(lines[i])) continue;          // 빈 줄은 조용히 무시
            Student? s = Student.FromCsv(lines[i]);
            if (s == null)
            {
                Console.WriteLine($"  {i + 1}번째 줄 건너뜀: {lines[i]}");
                skipped++;
                continue;
            }
            loaded.Add(s);
        }
        students.Clear();                 // 불러온 목록으로 바꾼다
        students.AddRange(loaded);
        Console.WriteLine($"{loaded.Count}명을 불러왔습니다. (잘못된 줄 {skipped}개)");
    }

    static void Main()
    {
        // 연습용 파일을 먼저 만든다 (일부러 망가진 줄 포함)
        File.WriteAllLines("test.csv", new[]
        {
            "김민준,90,85,77", "이서연,72,64,80", "잘못된 줄", "박지호,95,구십,98",
            "", "최유나,58,70,61", "정하준,85,80,187"
        });
        Load("test.csv");
        foreach (Student s in students)
            Console.WriteLine($"  {s.Name} 평균 {s.Average:F1}");
        Load("없는파일.csv");
    }
}`, expect: `  3번째 줄 건너뜀: 잘못된 줄
  4번째 줄 건너뜀: 박지호,95,구십,98
  7번째 줄 건너뜀: 정하준,85,80,187
3명을 불러왔습니다. (잘못된 줄 3개)
  김민준 평균 84.0
  이서연 평균 72.0
  최유나 평균 63.0
없는파일.csv 파일이 없습니다.`, desc: '<code>"박지호,95,구십,98"</code> 은 <code>TryParse</code> 가, <code>"정하준,85,80,187"</code> 은 <code>IsScore</code> 범위 검사가, <code>"잘못된 줄"</code> 은 <code>p.Length != 4</code> 가 걸러 냅니다. 한 줄이 잘못되어도 프로그램이 멈추지 않고 나머지를 읽는 것이 핵심입니다. 읽기 전 <code>File.Exists</code> 로 확인하지 않으면 없는 파일에서 <b>FileNotFoundException</b> 이 납니다.' },
          { type: 'callout', kind: 'info', title: '왜 바로 students 에 넣지 않고 loaded 에 모을까?', html: '읽는 도중 문제가 생겨도 기존 목록이 반쯤 지워진 상태가 되지 않도록, 새 목록을 <b>다 만든 뒤</b> 한 번에 바꿉니다(<code>Clear</code> + <code>AddRange</code>). 작은 습관이지만 “데이터가 절반만 바뀌는” 버그를 막아 줍니다.' },
          { type: 'h', text: '완성 — 클래스를 파일로 나누기' },
          { type: 'p', html: '이제 모든 기능이 준비되었습니다. 기능을 한 파일에 계속 쌓으면 300줄이 넘어 읽기 어려워지므로, 1교시 설계대로 <b>역할에 따라 세 파일</b>로 나눕니다. 특히 <code>Program</code> 의 <code>static List</code> 를 <b><code>GradeBook</code> 객체</b>로 옮겨, 목록을 다루는 코드(LINQ · 파일)와 화면 코드(Console)를 분리합니다.' },
          { type: 'table', head: ['파일', '내용', '역할'], rows: [
            ['<code>Student.cs</code>', '속성 · 계산 속성 · <code>ToCsv</code> · <code>FromCsv</code>', '학생 한 명의 데이터와 규칙'],
            ['<code>GradeBook.cs</code>', '<code>List&lt;Student&gt;</code> + <code>Add</code> · <code>Find</code> · <code>Search</code> · <code>Remove</code> · <code>Ranked</code> · <code>RankOf</code> · <code>Save</code> · <code>Load</code>', '목록 관리 (Console 을 쓰지 않음)'],
            ['<code>Program.cs</code>', '메뉴 반복 · <code>ReadInt</code> · 출력 메서드', '사용자와 대화 (화면 · 입력)']
          ] },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 클래스 파일 추가하기', html: '<b>솔루션 탐색기</b>에서 프로젝트를 오른쪽 클릭 → <b>추가 → 클래스…</b>(단축키 <b>Shift+Alt+C</b>) → 이름에 <code>Student.cs</code> 를 입력합니다. 같은 프로젝트의 클래스는 같은 네임스페이스에 있으면 <code>using</code> 없이 서로 쓸 수 있습니다. 아래 코드의 <code>// ===== File: 이름 =====</code> 줄은 이 강좌의 웹 실행기가 파일을 나누는 표시입니다.' },
          { type: 'p', html: '<code>GradeBook</code> 은 목록을 <code>private</code> 으로 숨기고, 밖에서는 <b>읽기 전용 목록 <code>IReadOnlyList&lt;Student&gt;</code></b>(<code>All</code>)만 보여 줍니다. 그래서 <code>Program</code> 은 <code>book.All.Add(…)</code> 처럼 규칙을 건너뛰어 목록을 바꿀 수 없고, 반드시 <code>book.Add</code> 를 거쳐야 합니다(8장 캡슐화).' },
          { type: 'code', title: '완성 프로그램. 콘솔 성적 관리 프로그램 (파일 분리 버전)', stdin: FINAL_STDIN, code: FINAL_CODE, expect: `
=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 등록된 학생이 없습니다.

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 이름: 국어: 영어: 수학: 김민준 추가 완료 (현재 1명)

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 이름: 국어: 영어: 수학: 이서연 추가 완료 (현재 2명)

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 이름: 국어: 영어: 수학: 박지호 추가 완료 (현재 3명)

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 이름: 국어: 영어:   → 0~100 사이의 정수를 입력하세요.
영어: 수학: 최유나 추가 완료 (현재 4명)

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 이름: 김민준 학생은 이미 등록되어 있습니다.

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 이름: 국어: 영어: 수학:   → 0~100 사이의 정수를 입력하세요.
수학: 정하준 추가 완료 (현재 5명)

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 번호 이름      국어 영어 수학  총점   평균 등급
----------------------------------------------
  1  김민준      90   85   77   252   84.0   B
  2  이서연      72   64   80   216   72.0   C
  3  박지호      95   92   98   285   95.0   A
  4  최유나      58   70   61   189   63.0   D
  5  정하준      85   80   87   252   84.0   B

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 석차 이름      총점   평균 등급
-------------------------------
  1  박지호     285   95.0   A
  2  김민준     252   84.0   B
  2  정하준     252   84.0   B
  4  이서연     216   72.0   C
  5  최유나     189   63.0   D

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 검색할 이름(일부도 가능):   김민준: 국어 90, 영어 85, 수학 77 → 평균 84.0 (B), 2등
  정하준: 국어 85, 영어 80, 수학 87 → 평균 84.0 (B), 2등

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 학생 수: 5명, 반 평균: 79.6
국어  평균  80.0  최고  95  최저  58
영어  평균  78.2  최고  92  최저  64
수학  평균  80.6  최고  98  최저  61
최우수: 박지호 (총점 285)
등급 분포: A 1명, B 2명, C 1명, D 1명

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: grades.csv 에 5명을 저장했습니다.

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 삭제할 이름: 최유나 학생을 삭제할까요? (y/n): 삭제했습니다. (남은 학생 4명)

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 삭제할 이름: 이서연 학생을 삭제할까요? (y/n): 취소했습니다.

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 번호 이름      국어 영어 수학  총점   평균 등급
----------------------------------------------
  1  김민준      90   85   77   252   84.0   B
  2  이서연      72   64   80   216   72.0   C
  3  박지호      95   92   98   285   95.0   A
  4  정하준      85   80   87   252   84.0   B

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 5명을 불러왔습니다.

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 석차 이름      총점   평균 등급
-------------------------------
  1  박지호     285   95.0   A
  2  김민준     252   84.0   B
  2  정하준     252   84.0   B
  4  이서연     216   72.0   C
  5  최유나     189   63.0   D

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 잘못된 선택입니다.

=== 성적 관리 프로그램 ===
1.추가 2.목록 3.석차 4.검색 5.통계 6.삭제 7.저장 8.불러오기 0.종료
선택: 프로그램을 종료합니다.`, desc: '테스트 시나리오: 빈 목록 → 5명 추가(잘못된 점수 “칠십” · 187 다시 묻기, 중복 이름 거절) → 목록 → 석차 → “준” 검색 → 통계 → <b>저장</b> → 최유나 삭제(y) → 이서연 삭제 취소(n) → 목록(4명) → <b>불러오기</b>(저장해 둔 5명 복원) → 석차 → 잘못된 메뉴 → 종료. 저장한 뒤 지운 최유나가 불러오기로 되살아나는 것을 확인하세요.' },
          { type: 'h', text: '테스트 — 요구사항 표로 확인하기' },
          { type: 'p', html: '1교시에 만든 요구사항 표가 그대로 <b>테스트 목록</b>이 됩니다. 정상 입력뿐 아니라 <b>경계값</b>과 <b>잘못된 입력</b>을 꼭 넣어 보세요.' },
          { type: 'table', head: ['구분', '입력', '기대 결과', '완성본'], rows: [
            ['정상', '김민준 90 85 77', '총점 252, 평균 84.0, B', '✔'],
            ['경계값', '점수 0 · 100, 평균 90.0 · 89.9', '받아들임, 등급 A · B', '✔'],
            ['잘못된 입력', '점수 <code>칠십</code> · <code>187</code> · <code>-1</code>', '다시 묻기 (예외 없음)', '✔'],
            ['잘못된 입력', '같은 이름, 빈 이름, 쉼표가 든 이름', '거절', '✔'],
            ['빈 목록', '학생 0명에서 2 · 3 · 5', '“등록된 학생이 없습니다.”', '✔'],
            ['동점', '252 두 명', '같은 석차 2, 다음은 4', '✔'],
            ['파일', '저장 → 삭제 → 불러오기', '저장 시점으로 복원', '✔'],
            ['파일', '망가진 줄 · 없는 파일', '건너뛰고 개수 알림 / “파일이 없습니다”', '✔']
          ] },
          { type: 'h', text: '확장 아이디어' },
          { type: 'list', items: [
            '<b>점수 수정</b> 메뉴 (실습 P1-3 을 메뉴에 연결)',
            '<b>과목 추가</b>: 점수를 <code>int[]</code> 나 <code>Dictionary&lt;string, int&gt;</code> 로 바꿔 과목 수를 자유롭게',
            '<b>CSV 머리글 줄</b>(<code>이름,국어,영어,수학</code>) 쓰고 읽기 (실습 P1-7)',
            '<b>성적표 보고서</b> 파일 만들기 (실습 P1-8)',
            '프로그램 시작 시 자동 불러오기 · 종료 시 “저장할까요?” 묻기',
            '<b>JSON 저장</b>: <code>System.Text.Json</code> 의 <code>JsonSerializer.Serialize(students)</code>'
          ] },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: WPF 로 옮긴다면?', html: '이번에 <code>GradeBook</code> 을 Console 없이 만든 덕분에, Part 2 에서 WPF 화면을 만들 때 <code>GradeBook</code> 과 <code>Student</code> 는 <b>그대로</b> 쓰고 <code>Program</code>(콘솔 화면)만 창(Window)으로 바꾸면 됩니다. “데이터 · 규칙” 과 “화면” 을 나누는 이 생각이 20장 MVVM 패턴의 출발점입니다.' }
        ],
        practice: [
          {
            title: '실습 P1-7. [확장] CSV 머리글 줄 쓰고 건너뛰기',
            level: 2,
            desc: '<p>엑셀에서 알아보기 쉽도록 저장할 때 첫 줄에 머리글 <code>이름,국어,영어,수학</code> 을 쓰고, 불러올 때는 첫 줄이 머리글이면 건너뛰도록 <code>Save</code> · <code>Load</code> 를 고치세요. 저장 → 목록 비우기 → 불러오기 후 인원과 이름을 출력합니다.</p>',
            hint: '저장: <code>var lines = new List&lt;string&gt; { Header }; lines.AddRange(students.Select(s =&gt; s.ToCsv()));</code> · 불러오기: <code>lines.Length &gt; 0 &amp;&amp; lines[0] == Header</code> 이면 <code>Skip(1)</code>',
            starter: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class Student
{
    public string Name { get; }
    public int Kor { get; }
    public int Eng { get; }
    public int Mat { get; }
    public Student(string name, int kor, int eng, int mat) { Name = name; Kor = kor; Eng = eng; Mat = mat; }
    public string ToCsv() => $"{Name},{Kor},{Eng},{Mat}";
    public static Student? FromCsv(string line)
    {
        string[] p = line.Split(',');
        if (p.Length != 4) return null;
        if (!int.TryParse(p[1], out int k) || !int.TryParse(p[2], out int e) || !int.TryParse(p[3], out int m)) return null;
        return new Student(p[0], k, e, m);
    }
}

class Program
{
    const string Header = "이름,국어,영어,수학";
    static List<Student> students = new List<Student>
    {
        new Student("김민준", 90, 85, 77), new Student("이서연", 72, 64, 80), new Student("박지호", 95, 92, 98)
    };

    static void Save(string path)
    {
        // TODO: 첫 줄에 Header 를 쓰기
        File.WriteAllLines(path, students.Select(s => s.ToCsv()));
    }

    static void Load(string path)
    {
        // TODO: 첫 줄이 Header 이면 건너뛰기
        students.Clear();
        foreach (string line in File.ReadAllLines(path))
        {
            Student? s = Student.FromCsv(line);
            if (s != null) students.Add(s);
        }
    }

    static void Main()
    {
        Save("grades2.csv");
        Console.WriteLine("첫 줄: " + File.ReadAllLines("grades2.csv")[0]);
        students.Clear();
        Load("grades2.csv");
        Console.WriteLine($"{students.Count}명: " + string.Join(", ", students.Select(s => s.Name)));
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class Student
{
    public string Name { get; }
    public int Kor { get; }
    public int Eng { get; }
    public int Mat { get; }
    public Student(string name, int kor, int eng, int mat) { Name = name; Kor = kor; Eng = eng; Mat = mat; }
    public string ToCsv() => $"{Name},{Kor},{Eng},{Mat}";
    public static Student? FromCsv(string line)
    {
        string[] p = line.Split(',');
        if (p.Length != 4) return null;
        if (!int.TryParse(p[1], out int k) || !int.TryParse(p[2], out int e) || !int.TryParse(p[3], out int m)) return null;
        return new Student(p[0], k, e, m);
    }
}

class Program
{
    const string Header = "이름,국어,영어,수학";
    static List<Student> students = new List<Student>
    {
        new Student("김민준", 90, 85, 77), new Student("이서연", 72, 64, 80), new Student("박지호", 95, 92, 98)
    };

    static void Save(string path)
    {
        var lines = new List<string> { Header };
        lines.AddRange(students.Select(s => s.ToCsv()));
        File.WriteAllLines(path, lines);
    }

    static void Load(string path)
    {
        string[] lines = File.ReadAllLines(path);
        IEnumerable<string> body = lines.Length > 0 && lines[0] == Header ? lines.Skip(1) : lines;
        students.Clear();
        foreach (string line in body)
        {
            Student? s = Student.FromCsv(line);
            if (s != null) students.Add(s);
        }
    }

    static void Main()
    {
        Save("grades2.csv");
        Console.WriteLine("첫 줄: " + File.ReadAllLines("grades2.csv")[0]);
        students.Clear();
        Load("grades2.csv");
        Console.WriteLine($"{students.Count}명: " + string.Join(", ", students.Select(s => s.Name)));
    }
}`,
            expect: `첫 줄: 이름,국어,영어,수학
3명: 김민준, 이서연, 박지호`
          },
          {
            title: '실습 P1-8. [확장] 성적표 보고서 파일 만들기',
            level: 3,
            desc: '<p><code>StreamWriter</code> 와 <code>using</code> 문으로 <code>report.txt</code> 에 다음 형식의 보고서를 쓰고, 다 쓴 뒤 파일을 읽어 화면에 출력하세요.</p><pre><code>[성적표] 5명\n1등 박지호 285 (A)\n2등 김민준 252 (B)\n...\n반 평균: 79.6</code></pre>',
            hint: '<code>using (var w = new StreamWriter("report.txt")) { w.WriteLine(…); }</code> — 블록이 끝나면 파일이 닫힙니다. 석차순은 <code>OrderByDescending</code> + <code>ThenBy</code>.',
            starter: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

    static void WriteReport(string path)
    {
        // TODO: StreamWriter 로 머리글 · 석차순 목록 · 반 평균 쓰기
        File.WriteAllText(path, "");
    }

    static void Main()
    {
        AddSample();
        WriteReport("report.txt");
        Console.Write(File.ReadAllText("report.txt"));
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

${CS_STUDENT}

class Program
{
    static List<Student> students = new List<Student>();

${CS_SAMPLE}

    static void WriteReport(string path)
    {
        using (var w = new StreamWriter(path))
        {
            w.WriteLine($"[성적표] {students.Count}명");
            foreach (Student s in students.OrderByDescending(s => s.Total).ThenBy(s => s.Name))
            {
                int rank = students.Count(o => o.Total > s.Total) + 1;
                w.WriteLine($"{rank}등 {s.Name} {s.Total} ({s.Grade})");
            }
            w.WriteLine($"반 평균: {students.Average(s => s.Average):F1}");
        }
    }

    static void Main()
    {
        AddSample();
        WriteReport("report.txt");
        Console.Write(File.ReadAllText("report.txt"));
    }
}`,
            expect: `[성적표] 5명
1등 박지호 285 (A)
2등 김민준 252 (B)
2등 정하준 252 (B)
4등 이서연 216 (C)
5등 최유나 189 (D)
반 평균: 79.6`
          }
        ],
        quiz: [
          { q: '<code>File.WriteAllLines("grades.csv", lines)</code> 를 두 번 호출하면 파일은?', options: ['두 번째 내용이 뒤에 덧붙는다', '두 번째 내용으로 덮어쓴다', '두 번째 호출에서 예외가 난다', '파일이 두 개 만들어진다'], answer: 1, explain: 'WriteAllLines · WriteAllText 는 덮어씁니다. 덧붙이려면 AppendAllLines · AppendAllText 를 씁니다.' },
          { q: '다음 코드의 출력은?<pre><code>string[] p = "박지호,95,구십,98".Split(\',\');\nbool ok = int.TryParse(p[2], out int eng);\nConsole.WriteLine($"{p.Length} {ok} {eng}");</code></pre>', options: ['4 True 90', '4 False 0', '3 False 0', '예외 발생'], answer: 1, explain: '쉼표로 나누면 4개. p[2] 는 "구십" 이라 TryParse 가 false, out 값은 0 입니다. 그래서 FromCsv 는 이 줄을 null 로 처리합니다.' },
          { q: 'CSV 에 총점 · 평균 · 등급을 저장하지 않는 가장 큰 이유는?', options: ['CSV 는 숫자를 3개까지만 저장할 수 있다', '점수로 언제든 다시 계산할 수 있어, 저장하면 값이 어긋날 위험만 생긴다', 'double 은 파일에 쓸 수 없다', '파일 크기 제한 때문에'], answer: 1, explain: '계산할 수 있는 값을 따로 저장하면, 누가 파일에서 점수만 고쳤을 때 총점과 어긋납니다. 원본 데이터만 저장하고 나머지는 계산 속성으로 구합니다.' },
          { q: '<code>GradeBook</code> 이 목록을 <code>private List&lt;Student&gt;</code> 로 숨기고 <code>IReadOnlyList&lt;Student&gt; All</code> 만 공개하는 이유는?', options: ['실행 속도가 빨라진다', '밖에서 규칙(중복 검사 등)을 건너뛰고 목록을 마음대로 바꾸지 못하게 하려고', 'List 는 public 으로 만들 수 없어서', '파일 저장을 하려면 필요해서'], answer: 1, explain: '캡슐화입니다. 목록을 바꾸는 길을 Add · Remove 같은 메서드로만 열어 두면 규칙을 한곳에서 지킬 수 있습니다.' }
        ],
        slides: [
          { layout: 'title', title: '완성과 확장', subtitle: 'Project 01 · 콘솔 성적 관리 프로그램 — 4교시', badge: 'P01-4',
            notes: '<p><b>[복습 3분]</b> “지금 프로그램을 끄면 어떻게 될까요?” → 입력한 학생이 모두 사라진다. 오늘의 첫 목표는 파일 저장입니다. 이어서 파일 분리 · 테스트 · 확장 과제.</p>' },
          { layout: 'diagram', title: 'CSV 저장과 불러오기', html: SVG_CSV, caption: '메모리(List) ↔ 파일(grades.csv)',
            notes: '<p><b>[4분]</b> CSV 파일을 메모장으로 열어 보여 주면 “그냥 글자” 라는 것을 바로 이해합니다. 총점 · 평균을 저장하지 않는 이유를 질문으로 던지세요.</p>' },
          { layout: 'code', title: '단계 7. 저장 — Select + WriteAllLines', code: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

record Student(string Name, int Kor, int Eng, int Mat)
{
    public string ToCsv() => $"{Name},{Kor},{Eng},{Mat}";
}

class Program
{
    static void Main()
    {
        var students = new List<Student>
        {
            new("김민준", 90, 85, 77), new("이서연", 72, 64, 80)
        };
        File.WriteAllLines("grades.csv", students.Select(s => s.ToCsv()));
        Console.Write(File.ReadAllText("grades.csv"));
    }
}`, points: ['<code>ToCsv()</code>: 학생 → 한 줄', '<code>Select</code>: 학생 목록 → 문자열 목록', '<code>WriteAllLines</code>: 덮어쓰기', 'VS: bin\\Debug\\net9.0 폴더에 생성'],
            notes: '<p><b>[4분]</b> Visual Studio 에서 실행 후 bin\\Debug\\net9.0 폴더를 열어 실제 파일을 보여 주세요. 엑셀로 열면 한글이 깨질 수 있다 → BOM 이야기는 vs 상자 참고.</p>' },
          { layout: 'code', title: '단계 8. 불러오기 — 한 줄씩 검사', code: `using System;
using System.IO;

class Program
{
    static void Main()
    {
        File.WriteAllLines("t.csv", new[] { "김민준,90,85,77", "잘못된 줄", "박지호,95,구십,98" });

        int ok = 0, skipped = 0;
        foreach (string line in File.ReadAllLines("t.csv"))
        {
            string[] p = line.Split(',');
            if (p.Length == 4 && int.TryParse(p[1], out int k)
                && int.TryParse(p[2], out int e) && int.TryParse(p[3], out int m))
            {
                Console.WriteLine($"{p[0]}: 평균 {(k + e + m) / 3.0:F1}");
                ok++;
            }
            else skipped++;
        }
        Console.WriteLine($"성공 {ok}줄, 건너뜀 {skipped}줄");
    }
}`, points: ['<code>Split(\',\')</code> → 개수부터 확인', '<code>TryParse</code> 로 숫자 확인', '한 줄이 틀려도 멈추지 않는다', '읽기 전에 <code>File.Exists</code>'],
            notes: '<p><b>[6분]</b> 발문: “사용자가 메모장으로 파일을 고치다가 실수하면?” → 불러오기에서 예외로 죽으면 모든 데이터를 못 쓰게 됩니다. 그래서 줄 단위 검사. 본문 예제는 이 검사를 <code>Student.FromCsv</code> 로 옮겼습니다.</p>' },
          { layout: 'table', title: '완성 — 세 파일로 나누기', head: ['파일', '역할', 'Console 사용'], rows: [['<code>Student.cs</code>', '학생 한 명 · 계산 속성 · CSV 변환', '✗'], ['<code>GradeBook.cs</code>', '목록 관리 · LINQ · 파일', '✗'], ['<code>Program.cs</code>', '메뉴 · 입력 · 출력', '✔']],
            lead: '“데이터 · 규칙” 과 “화면” 을 나눈다',
            notes: '<p><b>[4분]</b> Visual Studio 에서 Shift+Alt+C 로 클래스를 추가하는 모습을 시연합니다. Console 사용 열을 강조: GradeBook 에 Console 이 없으니 WPF 로 옮길 때 그대로 쓸 수 있다.</p>' },
          { layout: 'code', title: 'GradeBook — 캡슐화', code: `using System;
using System.Collections.Generic;
using System.Linq;

class GradeBook
{
    private readonly List<string> names = new List<string>();
    public IReadOnlyList<string> All => names;      // 읽기 전용으로만 공개

    public bool Add(string name)
    {
        if (name == "" || names.Contains(name)) return false;   // 규칙은 한곳에서
        names.Add(name);
        return true;
    }
}

class Program
{
    static void Main()
    {
        var book = new GradeBook();
        Console.WriteLine(book.Add("김민준"));
        Console.WriteLine(book.Add("김민준"));
        Console.WriteLine(string.Join(", ", book.All));
        // book.All.Add("x");   // 컴파일 오류: IReadOnlyList 에는 Add 가 없다
    }
}`, points: ['목록은 <code>private</code>', '밖에는 <code>IReadOnlyList</code> 만', '바꾸는 길은 <code>Add</code> 하나 → 규칙 보장'],
            notes: '<p><b>[4분]</b> 주석을 풀어 컴파일 오류를 보여 주세요. 8장 캡슐화(속성으로 필드 보호)를 “목록 보호” 로 확장한 것입니다.</p>' },
          { layout: 'table', title: '테스트 시나리오', head: ['구분', '입력', '기대 결과'], rows: [['정상', '김민준 90 85 77', '252 · 84.0 · B'], ['경계값', '0 · 100 · 평균 89.9', '받아들임 · B'], ['잘못된 입력', '칠십 · 187 · 같은 이름', '다시 묻기 · 거절'], ['빈 목록', '0명에서 목록 · 통계', '안내 문구'], ['파일', '저장 → 삭제 → 불러오기', '복원']],
            lead: '요구사항 표 = 테스트 목록',
            notes: '<p><b>[5분]</b> 완성 프로그램을 교사 화면에서 실행하며 표를 한 줄씩 체크합니다. 학생들에게 “프로그램을 망가뜨릴 입력” 을 제안하게 하면 수업이 활발해집니다.</p>' },
          { layout: 'bullets', title: '확장 과제', lead: '완성본에 기능 하나씩 더하기',
            bullets: ['점수 수정 메뉴 (실습 P1-3 연결)', 'CSV 머리글 줄 (실습 P1-7)', '성적표 보고서 파일 — StreamWriter (실습 P1-8)', '시작 시 자동 불러오기 · 종료 시 저장 확인', '과목을 자유롭게: <code>Dictionary&lt;string, int&gt;</code>', 'JSON 저장: <code>JsonSerializer</code>'],
            notes: '<p><b>[12분]</b> 수준에 따라 P1-7(기초) → P1-8(도전) 순서로 안내합니다. 빨리 끝난 학생은 자동 불러오기 · 저장 확인을 완성본에 직접 넣어 보게 하세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>"박지호,95,구십,98".Split(\',\')</code> 의 결과 개수와 <code>int.TryParse(p[2], out _)</code> 의 결과는?', options: ['4, true', '4, false', '3, false', '5, true'], answer: 1, explain: '쉼표 3개로 4조각. "구십" 은 숫자가 아니므로 false — 그 줄은 건너뜁니다.',
            notes: '<p><b>[2분]</b> 이 퀴즈의 줄이 단계 8 예제의 망가진 줄과 같다는 것을 연결해 주세요.</p>' },
          { layout: 'practice', title: '실습 P1-7. CSV 머리글 줄', desc: '저장할 때 첫 줄에 <code>이름,국어,영어,수학</code> 을 쓰고, 불러올 때 첫 줄이 머리글이면 <code>Skip(1)</code>', starter: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class Program
{
    const string Header = "이름,국어,영어,수학";

    static void Main()
    {
        var rows = new List<string> { "김민준,90,85,77", "이서연,72,64,80" };
        // TODO: Header + rows 를 저장
        File.WriteAllLines("g.csv", rows);
        // TODO: 읽을 때 첫 줄이 Header 이면 건너뛰기
        string[] lines = File.ReadAllLines("g.csv");
        Console.WriteLine($"학생 {lines.Length}명");
    }
}`, solution: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class Program
{
    const string Header = "이름,국어,영어,수학";

    static void Main()
    {
        var rows = new List<string> { "김민준,90,85,77", "이서연,72,64,80" };
        File.WriteAllLines("g.csv", new[] { Header }.Concat(rows));
        string[] lines = File.ReadAllLines("g.csv");
        var body = lines.Length > 0 && lines[0] == Header ? lines.Skip(1) : lines;
        Console.WriteLine($"첫 줄: {lines[0]}");
        Console.WriteLine($"학생 {body.Count()}명: " + string.Join(" / ", body));
    }
}`,
            notes: '<p><b>[실습 안내]</b> 머리글이 없는 옛날 파일도 읽을 수 있게 “첫 줄이 머리글일 때만” 건너뛰는 것이 포인트입니다(하위 호환).</p>' },
          { layout: 'summary', title: '프로젝트 정리', bullets: ['저장: <code>Select(s =&gt; s.ToCsv())</code> + <code>File.WriteAllLines</code>', '불러오기: <code>ReadAllLines</code> → <code>Split</code> → <code>TryParse</code> → 잘못된 줄 건너뛰기', '역할 분리: Student · GradeBook · Program', '캡슐화: 목록은 private, 밖에는 IReadOnlyList', '요구사항 표 = 테스트 목록', '다음 프로젝트 P02: 상속 · 인터페이스 · 사용자 정의 예외로 은행 계좌'],
            notes: '<p>4교시 동안 만든 것을 돌아봅니다: 설계 → 단계 1~8 → 완성 → 테스트. “처음 설계한 클래스 그림과 완성본을 비교해 보세요.” P02 에서는 상속과 인터페이스가 본격적으로 등장합니다.</p>' }
        ]
      }
    ]
  });
})();
