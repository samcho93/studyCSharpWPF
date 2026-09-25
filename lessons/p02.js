/* Project 02. 은행 계좌 관리 (클래스) — Bank Account Manager */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  /* ---------- 여러 예제에서 함께 쓰는 C# 코드 조각 ---------- */
  const CS_EXC = `// 은행 규칙 위반을 나타내는 예외들 — 모두 BankException 의 자식
class BankException : Exception
{
    public BankException(string message) : base(message) { }
}

class InvalidAmountException : BankException
{
    public decimal Amount { get; }
    public InvalidAmountException(decimal amount)
        : base($"금액은 0보다 커야 합니다 (입력: {amount:N0}원)") { Amount = amount; }
}

class InsufficientFundsException : BankException
{
    public decimal Available { get; }
    public decimal Requested { get; }
    public InsufficientFundsException(decimal available, decimal requested)
        : base($"잔액이 부족합니다 (출금 가능 {available:N0}원, 요청 {requested:N0}원)")
    {
        Available = available;
        Requested = requested;
    }
}

class AccountNotFoundException : BankException
{
    public AccountNotFoundException(string number) : base($"계좌를 찾을 수 없습니다: {number}") { }
}`;

  const CS_CLOCK = `// 현재 시각을 알려 주는 역할 — 진짜 시계와 테스트용 시계를 바꿔 끼울 수 있다
interface IClock
{
    DateTime Now { get; }
}

class SystemClock : IClock          // 진짜 시계: 실행할 때마다 값이 다르다
{
    public DateTime Now => DateTime.Now;
}

class FakeClock : IClock            // 테스트용 시계: 정한 시각에서 시작해 직접 흘려보낸다
{
    public DateTime Now { get; private set; }
    public FakeClock(DateTime start) { Now = start; }
    public void Advance(TimeSpan span) { Now = Now + span; }
}`;

  const CS_TX = `class Transaction
{
    public DateTime Date { get; }
    public string Kind { get; }            // 입금 · 출금 · 이자
    public decimal Amount { get; }         // 들어오면 +, 나가면 -
    public decimal BalanceAfter { get; }   // 거래 후 잔액
    public string Memo { get; }

    public Transaction(DateTime date, string kind, decimal amount, decimal balanceAfter, string memo)
    {
        Date = date; Kind = kind; Amount = amount; BalanceAfter = balanceAfter; Memo = memo;
    }

    public override string ToString() =>
        $"{Date:MM-dd HH:mm}  {Kind}  {Amount,10:+#,0;-#,0}  잔액 {BalanceAfter,10:N0}  {Memo}";
}`;

  // 2교시: 아직 상속 전 — 구체 클래스 Account (번호 · 시계 주입)
  const CS_ACCOUNT_BASIC = `class Account
{
    private readonly List<Transaction> history = new List<Transaction>();
    private readonly IClock clock;

    public string Number { get; }
    public string Owner { get; }
    public decimal Balance { get; private set; }
    public IReadOnlyList<Transaction> History => history;

    public Account(string number, string owner, IClock clock)
    {
        Number = number; Owner = owner; this.clock = clock;
    }

    public void Deposit(decimal amount, string memo = "")
    {
        if (amount <= 0) throw new InvalidAmountException(amount);
        Change(amount, "입금", memo);
    }

    public void Withdraw(decimal amount, string memo = "")
    {
        if (amount <= 0) throw new InvalidAmountException(amount);
        if (amount > Balance) throw new InsufficientFundsException(Balance, amount);
        Change(-amount, "출금", memo);
    }

    // 잔액을 바꾸는 유일한 길 — 바꿀 때 반드시 거래 내역을 남긴다
    private void Change(decimal delta, string kind, string memo)
    {
        Balance += delta;
        history.Add(new Transaction(clock.Now, kind, delta, Balance, memo));
    }
}`;

  // 3교시 이후: 추상 클래스 Account + 두 가지 파생 계좌 + 인터페이스
  const CS_ACCOUNTS = `interface IInterestBearing
{
    decimal InterestRate { get; }
    decimal ApplyInterest();                 // 이자를 넣고, 넣은 금액을 돌려준다
}

abstract class Account
{
    private readonly List<Transaction> history = new List<Transaction>();
    private readonly IClock clock;

    public string Number { get; }
    public string Owner { get; }
    public decimal Balance { get; private set; }
    public IReadOnlyList<Transaction> History => history;

    public abstract string KindName { get; }        // 계좌 종류 이름 — 파생 클래스가 정한다
    public virtual decimal Available => Balance;     // 출금 가능 금액 — 파생 클래스가 바꿀 수 있다

    protected Account(string number, string owner, IClock clock)
    {
        Number = number; Owner = owner; this.clock = clock;
    }

    public void Deposit(decimal amount, string memo = "")
    {
        if (amount <= 0) throw new InvalidAmountException(amount);
        Change(amount, "입금", memo);
    }

    public void Withdraw(decimal amount, string memo = "")
    {
        if (amount <= 0) throw new InvalidAmountException(amount);
        ValidateWithdraw(amount);
        Change(-amount, "출금", memo);
    }

    // 출금해도 되는지 검사 — 규칙이 다른 계좌는 재정의(override)한다
    protected virtual void ValidateWithdraw(decimal amount)
    {
        if (amount > Available) throw new InsufficientFundsException(Available, amount);
    }

    // 잔액을 바꾸는 유일한 길 — 파생 클래스(이자 등)도 이 메서드를 거친다
    protected void Change(decimal delta, string kind, string memo)
    {
        Balance += delta;
        history.Add(new Transaction(clock.Now, kind, delta, Balance, memo));
    }

    public override string ToString() => $"[{KindName}] {Number} {Owner} 잔액 {Balance:N0}원";
}

class SavingsAccount : Account, IInterestBearing
{
    public decimal InterestRate { get; }

    public SavingsAccount(string number, string owner, IClock clock, decimal rate)
        : base(number, owner, clock)
    {
        InterestRate = rate;
    }

    public override string KindName => "저축예금";

    public decimal ApplyInterest()
    {
        decimal interest = Math.Floor(Balance * InterestRate);   // 원 단위 미만은 버린다
        if (interest > 0) Change(interest, "이자", $"연 {InterestRate:P1}");
        return interest;
    }
}

class CheckingAccount : Account
{
    public decimal OverdraftLimit { get; }       // 마이너스 한도

    public CheckingAccount(string number, string owner, IClock clock, decimal limit)
        : base(number, owner, clock)
    {
        OverdraftLimit = limit;
    }

    public override string KindName => "마이너스통장";
    public override decimal Available => Balance + OverdraftLimit;   // 잔액이 0 이어도 한도만큼 출금 가능
}`;

  const CS_BANK = `class Bank
{
    private readonly Dictionary<string, Account> accounts = new Dictionary<string, Account>();
    private readonly IClock clock;
    private int seq = 0;

    public Bank(IClock clock) { this.clock = clock; }

    public IEnumerable<Account> Accounts => accounts.Values;

    private string NewNumber(string prefix) => $"{prefix}-{++seq:D4}";

    public SavingsAccount OpenSavings(string owner, decimal rate, decimal initial)
    {
        var acc = new SavingsAccount(NewNumber("110"), owner, clock, rate);
        Register(acc, initial);
        return acc;
    }

    public CheckingAccount OpenChecking(string owner, decimal limit, decimal initial)
    {
        var acc = new CheckingAccount(NewNumber("220"), owner, clock, limit);
        Register(acc, initial);
        return acc;
    }

    private void Register(Account acc, decimal initial)
    {
        accounts.Add(acc.Number, acc);
        if (initial > 0) acc.Deposit(initial, "개설 입금");
    }

    public Account Find(string number)
    {
        if (accounts.TryGetValue(number.Trim(), out Account? acc)) return acc;
        throw new AccountNotFoundException(number);
    }

    public void Transfer(string fromNo, string toNo, decimal amount)
    {
        Account from = Find(fromNo);
        Account to = Find(toNo);
        if (from == to) throw new BankException("같은 계좌로는 이체할 수 없습니다");
        from.Withdraw(amount, $"{to.Owner}님께 이체");     // 실패하면 여기서 예외 → 입금은 일어나지 않는다
        to.Deposit(amount, $"{from.Owner}님이 이체");
    }
}`;

  /* ---------- SVG 그림 ---------- */
  const SVG_CLASS = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="은행 계좌 프로그램의 클래스 설계">
  <defs>
    <marker id="ap2a" markerWidth="16" markerHeight="16" refX="14" refY="8" orient="auto" viewBox="0 0 16 16" markerUnits="userSpaceOnUse"><path d="M0,0 L16,8 L0,16 z" fill="var(--card)" stroke="var(--accent)" stroke-width="2"/></marker>
    <marker id="ap2b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker>
  </defs>
  <rect x="30" y="30" width="310" height="130" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="185" y="68" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--fg)">class Bank</text>
  <text x="50" y="105" style="${MONO};font-size:17px;fill:var(--fg)">Dictionary&lt;string, Account&gt;</text>
  <text x="50" y="138" style="${MONO};font-size:17px;fill:var(--fg)">Open · Find · Transfer</text>
  <rect x="420" y="30" width="440" height="280" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <rect x="420" y="30" width="440" height="55" rx="12" fill="var(--accent)" opacity="0.18"/>
  <text x="640" y="66" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--fg)">abstract class Account</text>
  <g style="${MONO};font-size:18px;fill:var(--fg)">
    <text x="440" y="115">Number · Owner</text>
    <text x="440" y="143">Balance { get; private set; }</text>
    <text x="440" y="171">History (읽기 전용 목록)</text>
    <text x="440" y="199" fill="var(--accent2)">abstract KindName</text>
    <text x="440" y="227" fill="var(--accent2)">virtual Available</text>
    <text x="440" y="255">Deposit() · Withdraw()</text>
    <text x="440" y="283" fill="var(--muted)">protected Change() — 내역 기록</text>
  </g>
  <rect x="940" y="30" width="310" height="130" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="1095" y="68" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--fg)">class Transaction</text>
  <text x="960" y="105" style="${MONO};font-size:17px;fill:var(--fg)">Date · Kind · Amount</text>
  <text x="960" y="138" style="${MONO};font-size:17px;fill:var(--fg)">BalanceAfter · Memo</text>
  <rect x="940" y="190" width="310" height="120" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3" stroke-dasharray="9 6"/>
  <text x="1095" y="228" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">interface IClock</text>
  <text x="960" y="262" style="${MONO};font-size:17px;fill:var(--fg)">DateTime Now</text>
  <text x="960" y="292" style="font-size:16px;fill:var(--muted)">SystemClock · FakeClock</text>
  <rect x="30" y="380" width="270" height="140" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3" stroke-dasharray="9 6"/>
  <text x="165" y="415" text-anchor="middle" style="font-size:20px;font-weight:700;fill:var(--fg)">interface</text>
  <text x="165" y="443" text-anchor="middle" style="font-size:20px;font-weight:700;fill:var(--fg)">IInterestBearing</text>
  <text x="50" y="478" style="${MONO};font-size:17px;fill:var(--fg)">InterestRate</text>
  <text x="50" y="505" style="${MONO};font-size:17px;fill:var(--fg)">ApplyInterest()</text>
  <rect x="380" y="380" width="340" height="140" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="550" y="415" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">SavingsAccount (저축예금)</text>
  <text x="400" y="450" style="${MONO};font-size:17px;fill:var(--fg)">InterestRate · ApplyInterest()</text>
  <text x="400" y="480" style="${MONO};font-size:17px;fill:var(--accent2)">KindName =&gt; "저축예금"</text>
  <text x="400" y="505" style="font-size:16px;fill:var(--muted)">출금 가능 = 잔액</text>
  <rect x="780" y="380" width="360" height="140" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="960" y="415" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">CheckingAccount (마이너스)</text>
  <text x="800" y="450" style="${MONO};font-size:17px;fill:var(--fg)">OverdraftLimit</text>
  <text x="800" y="480" style="${MONO};font-size:17px;fill:var(--accent2)">override Available</text>
  <text x="800" y="505" style="font-size:16px;fill:var(--muted)">출금 가능 = 잔액 + 한도</text>
  <g stroke="var(--accent)" stroke-width="3" fill="none">
    <path d="M550,378 L600,318" marker-end="url(#ap2a)"/>
    <path d="M960,378 L760,318" marker-end="url(#ap2a)"/>
  </g>
  <path d="M378,450 L306,450" stroke="var(--warn)" stroke-width="3" stroke-dasharray="8 6" fill="none" marker-end="url(#ap2a)"/>
  <g stroke="var(--muted)" stroke-width="3" fill="none">
    <path d="M340,95 L414,95" marker-end="url(#ap2b)"/>
    <path d="M860,95 L934,95" marker-end="url(#ap2b)"/>
    <path d="M860,250 L934,250" marker-end="url(#ap2b)"/>
  </g>
  <text x="377" y="85" text-anchor="middle" style="font-size:15px;fill:var(--muted)">여러 개</text>
  <text x="897" y="85" text-anchor="middle" style="font-size:15px;fill:var(--muted)">기록</text>
  <text x="897" y="240" text-anchor="middle" style="font-size:15px;fill:var(--muted)">시각</text>
  <text x="640" y="552" text-anchor="middle" style="font-size:18px;fill:var(--muted)">실선 삼각형 = 상속(:) · 점선 삼각형 = 인터페이스 구현 · 화살표 = 가지고 있다/사용한다</text>
</svg>`;

  const SVG_EXC = `<svg viewBox="0 0 1280 440" width="100%" role="img" aria-label="은행 예외 클래스 계층">
  <g stroke="var(--line)" stroke-width="3">
    <line x1="640" y1="100" x2="640" y2="150"/>
    <line x1="640" y1="220" x2="640" y2="250"/>
    <line x1="230" y1="250" x2="1050" y2="250"/>
    <line x1="230" y1="250" x2="230" y2="280"/><line x1="640" y1="250" x2="640" y2="280"/><line x1="1050" y1="250" x2="1050" y2="280"/>
  </g>
  <rect x="490" y="30" width="300" height="70" rx="12" fill="var(--card)" stroke="var(--muted)" stroke-width="3"/>
  <text x="640" y="74" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">Exception</text>
  <rect x="470" y="150" width="340" height="70" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="640" y="194" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--accent)">BankException</text>
  <text x="840" y="194" style="font-size:19px;fill:var(--muted)">← catch 하나로 모두 잡는다</text>
  <g style="${MONO};font-size:20px;fill:var(--fg)">
    <rect x="50" y="280" width="360" height="110" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
    <text x="230" y="320" text-anchor="middle" font-weight="700">InvalidAmount</text>
    <text x="230" y="348" text-anchor="middle" font-weight="700">Exception</text>
    <text x="230" y="378" text-anchor="middle" style="font-size:17px;fill:var(--muted)">Amount</text>
    <rect x="460" y="280" width="360" height="110" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
    <text x="640" y="320" text-anchor="middle" font-weight="700">InsufficientFunds</text>
    <text x="640" y="348" text-anchor="middle" font-weight="700">Exception</text>
    <text x="640" y="378" text-anchor="middle" style="font-size:17px;fill:var(--muted)">Available · Requested</text>
    <rect x="870" y="280" width="360" height="110" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
    <text x="1050" y="320" text-anchor="middle" font-weight="700">AccountNotFound</text>
    <text x="1050" y="348" text-anchor="middle" font-weight="700">Exception</text>
    <text x="1050" y="378" text-anchor="middle" style="font-size:17px;fill:var(--muted)">(계좌번호를 메시지에)</text>
  </g>
  <text x="230" y="425" text-anchor="middle" style="font-size:18px;fill:var(--muted)">0원 · 음수 입금/출금</text>
  <text x="640" y="425" text-anchor="middle" style="font-size:18px;fill:var(--muted)">출금 가능 금액 초과</text>
  <text x="1050" y="425" text-anchor="middle" style="font-size:18px;fill:var(--muted)">없는 계좌번호</text>
</svg>`;

  const SVG_TRANSFER = `<svg viewBox="0 0 1280 500" width="100%" role="img" aria-label="이체의 순서와 실패 처리">
  <defs><marker id="ap2c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker>
  <marker id="ap2d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--danger)"/></marker></defs>
  <text x="640" y="40" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--fg)">bank.Transfer("110-0001", "220-0002", 30000)</text>
  <g style="font-size:21px">
    <rect x="40" y="90" width="230" height="80" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="155" y="125" text-anchor="middle" style="font-weight:700;fill:var(--fg)">① Find(from)</text>
    <text x="155" y="155" text-anchor="middle" style="font-size:17px;fill:var(--muted)">Find(to)</text>
    <rect x="340" y="90" width="230" height="80" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="455" y="125" text-anchor="middle" style="font-weight:700;fill:var(--fg)">② 같은 계좌?</text>
    <text x="455" y="155" text-anchor="middle" style="font-size:17px;fill:var(--muted)">from == to</text>
    <rect x="640" y="90" width="270" height="80" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="775" y="125" text-anchor="middle" style="font-weight:700;fill:var(--fg)">③ from.Withdraw</text>
    <text x="775" y="155" text-anchor="middle" style="font-size:17px;fill:var(--muted)">금액 · 잔액 검사</text>
    <rect x="980" y="90" width="260" height="80" rx="10" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="1110" y="125" text-anchor="middle" style="font-weight:700;fill:var(--fg)">④ to.Deposit</text>
    <text x="1110" y="155" text-anchor="middle" style="font-size:17px;fill:var(--muted)">검사를 통과한 금액만</text>
  </g>
  <g stroke="var(--ok)" stroke-width="4" fill="none">
    <path d="M272,130 L335,130" marker-end="url(#ap2c)"/>
    <path d="M572,130 L635,130" marker-end="url(#ap2c)"/>
    <path d="M912,130 L975,130" marker-end="url(#ap2c)"/>
  </g>
  <g stroke="var(--danger)" stroke-width="3" fill="none" stroke-dasharray="8 6">
    <path d="M155,172 L155,300" marker-end="url(#ap2d)"/>
    <path d="M455,172 L455,300" marker-end="url(#ap2d)"/>
    <path d="M775,172 L775,300" marker-end="url(#ap2d)"/>
  </g>
  <rect x="40" y="305" width="870" height="110" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="475" y="345" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--danger)">예외 발생 → 그 자리에서 Transfer 를 빠져나간다</text>
  <text x="475" y="380" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">AccountNotFound · BankException · InvalidAmount · InsufficientFunds</text>
  <text x="475" y="405" text-anchor="middle" style="font-size:17px;fill:var(--muted)">④ 입금은 실행되지 않으므로 돈이 “사라지거나 생기는” 일이 없다</text>
  <text x="1110" y="220" text-anchor="middle" style="font-size:19px;fill:var(--ok)">둘 다 성공 = 이체 완료</text>
  <text x="640" y="470" text-anchor="middle" style="font-size:20px;fill:var(--muted)">핵심: 실패할 수 있는 일(출금 검사)을 먼저, 되돌리기 어려운 일(입금)은 마지막에</text>
</svg>`;

  const SVG_POLY = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="가상 속성 Available 로 달라지는 출금 규칙">
  <defs><marker id="ap2e" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="440" y="30" width="400" height="70" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="640" y="74" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">acc.Withdraw(400000)</text>
  <rect x="340" y="140" width="600" height="110" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="640" y="178" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">Account.Withdraw (공통 흐름 — 하나만 있다)</text>
  <text x="640" y="212" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">금액 검사 → ValidateWithdraw → Change</text>
  <text x="640" y="238" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--accent)">if (amount &gt; Available) throw …</text>
  <path d="M640,102 L640,135" stroke="var(--accent)" stroke-width="3" fill="none" marker-end="url(#ap2e)"/>
  <path d="M520,252 L300,318" stroke="var(--accent)" stroke-width="3" fill="none" marker-end="url(#ap2e)"/>
  <path d="M760,252 L980,318" stroke="var(--accent)" stroke-width="3" fill="none" marker-end="url(#ap2e)"/>
  <text x="640" y="300" text-anchor="middle" style="font-size:19px;fill:var(--muted)">Available 은 virtual — 실제 객체의 형식에 따라 다른 코드가 실행된다</text>
  <rect x="60" y="325" width="480" height="170" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="300" y="362" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">SavingsAccount (잔액 100,000)</text>
  <text x="300" y="398" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">Available =&gt; Balance</text>
  <text x="300" y="432" text-anchor="middle" style="font-size:20px;fill:var(--fg)">= 100,000 &lt; 400,000</text>
  <text x="300" y="472" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--danger)">InsufficientFundsException</text>
  <rect x="740" y="325" width="480" height="170" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="980" y="362" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">CheckingAccount (잔액 100,000)</text>
  <text x="980" y="398" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">Available =&gt; Balance + Limit</text>
  <text x="980" y="432" text-anchor="middle" style="font-size:20px;fill:var(--fg)">= 100,000 + 500,000 ≥ 400,000</text>
  <text x="980" y="472" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--ok)">출금 성공 → 잔액 -300,000</text>
</svg>`;

  /* ---------- 완성 프로그램 ---------- */
  const FINAL_CODE = `// ===== File: BankExceptions.cs =====
using System;

${CS_EXC}

// ===== File: Clock.cs =====
using System;

${CS_CLOCK}

// ===== File: Transaction.cs =====
using System;

${CS_TX}

// ===== File: Accounts.cs =====
using System;
using System.Collections.Generic;

${CS_ACCOUNTS}

// ===== File: Bank.cs =====
using System;
using System.Collections.Generic;
using System.Linq;

${CS_BANK}

// ===== File: Program.cs =====
using System;
using System.Linq;

class Program
{
    // 테스트용 시계 — 메뉴를 하나 처리할 때마다 10분씩 흐른다 (실제 서비스라면 new SystemClock())
    static readonly FakeClock clock = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));
    static readonly Bank bank = new Bank(clock);

    static void Main()
    {
        while (true)
        {
            Console.WriteLine();
            Console.WriteLine($"=== C# 은행 ({clock.Now:yyyy-MM-dd HH:mm}) ===");
            Console.WriteLine("1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료");
            Console.Write("선택: ");
            string? input = Console.ReadLine();
            if (input == null || input.Trim() == "0")
            {
                Console.WriteLine("이용해 주셔서 감사합니다.");
                break;
            }
            try
            {
                switch (input.Trim())
                {
                    case "1": Open(); break;
                    case "2": Deposit(); break;
                    case "3": Withdraw(); break;
                    case "4": Transfer(); break;
                    case "5": ShowHistory(); break;
                    case "6": ShowAccounts(); break;
                    case "7": PayInterest(); break;
                    case "8": Report(); break;
                    default: Console.WriteLine("잘못된 선택입니다."); break;
                }
            }
            catch (BankException ex)             // 은행 규칙 위반은 모두 여기 한곳에서 처리
            {
                Console.WriteLine($"[오류] {ex.Message}");
            }
            clock.Advance(TimeSpan.FromMinutes(10));
        }
    }

    static string Ask(string prompt)
    {
        Console.Write(prompt);
        return (Console.ReadLine() ?? "").Trim();
    }

    // 숫자가 아니면 다시 묻는다. "10,000" 처럼 쉼표가 있어도 된다. 빈 입력은 0
    static decimal AskAmount(string prompt)
    {
        while (true)
        {
            string text = Ask(prompt);
            if (text == "") return 0;
            if (decimal.TryParse(text, out decimal amount)) return amount;
            Console.WriteLine("  → 숫자로 입력하세요.");
        }
    }

    static void Open()
    {
        string kind = Ask("종류 (1.저축예금 2.마이너스통장): ");
        if (kind != "1" && kind != "2") { Console.WriteLine("종류는 1 또는 2 입니다."); return; }
        string owner = Ask("이름: ");
        if (owner == "") { Console.WriteLine("이름을 입력하세요."); return; }
        decimal initial = AskAmount("첫 입금액 (없으면 0): ");
        if (initial < 0) throw new InvalidAmountException(initial);
        Account acc = kind == "1"
            ? bank.OpenSavings(owner, 0.025m, initial)
            : bank.OpenChecking(owner, 1_000_000m, initial);
        Console.WriteLine($"개설 완료: {acc}");
    }

    static void Deposit()
    {
        Account acc = bank.Find(Ask("계좌번호: "));
        acc.Deposit(AskAmount("입금액: "), "창구 입금");
        Console.WriteLine($"입금 완료 → 잔액 {acc.Balance:N0}원");
    }

    static void Withdraw()
    {
        Account acc = bank.Find(Ask("계좌번호: "));
        acc.Withdraw(AskAmount("출금액: "), "창구 출금");
        Console.WriteLine($"출금 완료 → 잔액 {acc.Balance:N0}원 (출금 가능 {acc.Available:N0}원)");
    }

    static void Transfer()
    {
        string from = Ask("보내는 계좌: ");
        string to = Ask("받는 계좌: ");
        decimal amount = AskAmount("금액: ");
        bank.Transfer(from, to, amount);
        Console.WriteLine($"이체 완료: {from} → {to} {amount:N0}원");
    }

    static void ShowHistory()
    {
        Account acc = bank.Find(Ask("계좌번호: "));
        Console.WriteLine(acc);
        if (acc.History.Count == 0) { Console.WriteLine("  거래 내역이 없습니다."); return; }
        foreach (Transaction t in acc.History)
            Console.WriteLine("  " + t);
    }

    static void ShowAccounts()
    {
        if (!bank.Accounts.Any()) { Console.WriteLine("개설된 계좌가 없습니다."); return; }
        foreach (Account a in bank.Accounts)
        {
            string extra = a switch
            {
                SavingsAccount s => $"금리 {s.InterestRate:P1}",
                CheckingAccount c => $"한도 {c.OverdraftLimit:N0}원",
                _ => ""
            };
            Console.WriteLine($"{a}  ({extra}, 출금 가능 {a.Available:N0}원)");
        }
    }

    static void PayInterest()
    {
        decimal total = 0;
        foreach (Account a in bank.Accounts)
        {
            if (a is IInterestBearing ib)
            {
                decimal interest = ib.ApplyInterest();
                total += interest;
                Console.WriteLine($"  {a.Number} {a.Owner}: 이자 {interest:N0}원");
            }
        }
        Console.WriteLine($"이자 지급 합계: {total:N0}원");
    }

    static void Report()
    {
        var all = bank.Accounts.ToList();
        if (all.Count == 0) { Console.WriteLine("개설된 계좌가 없습니다."); return; }
        Console.WriteLine($"계좌 {all.Count}개 · 고객 {all.Select(a => a.Owner).Distinct().Count()}명");
        Console.WriteLine($"예금 합계 {all.Where(a => a.Balance > 0).Sum(a => a.Balance):N0}원, " +
                          $"마이너스 합계 {all.Where(a => a.Balance < 0).Sum(a => a.Balance):N0}원");
        foreach (var g in all.GroupBy(a => a.KindName))
            Console.WriteLine($"  {g.Key}: {g.Count()}개, 잔액 합계 {g.Sum(a => a.Balance):N0}원");
        var txs = all.SelectMany(a => a.History);
        foreach (var g in txs.GroupBy(t => t.Kind).OrderBy(g => g.Key))
            Console.WriteLine($"  {g.Key} {g.Count()}건, 합계 {g.Sum(t => t.Amount):+#,0;-#,0}원");
        Account top = all.MaxBy(a => a.Balance)!;
        Console.WriteLine($"잔액 1위: {top.Owner} ({top.Number}) {top.Balance:N0}원");
    }
}`;

  const FINAL_STDIN = [
    '6',
    '1', '1', '김민준', '1,000,000',
    '1', '2', '이서연', '100000',
    '1', '1', '박지호', '500000',
    '1', '3',
    '2', '110-0001', '50000',
    '2', '110-0001', '-3000',
    '3', '220-0002', '450000',
    '3', '110-0003', '600000',
    '3', '999-9999',
    '4', '110-0001', '220-0002', '200,000',
    '4', '110-0003', '110-0003', '1000',
    '4', '110-0001', '220-0002', '오십만', '5000000',
    '7',
    '5', '220-0002',
    '6',
    '8',
    '9',
    '0'
  ].join('\n') + '\n';

  CS_COURSE.addChapter({
    id: 'p02',
    no: 'P02',
    title: '은행 계좌 관리 (클래스)',
    subtitle: 'Project · Bank Account Manager',
    summary: '캡슐화된 Account 클래스에서 출발해 사용자 정의 예외, 거래 내역(List<Transaction>)과 시계 인터페이스(IClock), Dictionary 로 계좌를 찾는 Bank, 상속(저축예금 · 마이너스통장)과 인터페이스 · 다형성, LINQ 보고서까지 — 객체지향의 핵심을 모두 쓰는 은행 계좌 관리 프로그램을 단계별로 완성합니다.',
    goals: [
      '잔액처럼 규칙이 있는 데이터를 private set 과 메서드로 보호(캡슐화)할 수 있다',
      '규칙 위반을 사용자 정의 예외 계층으로 표현하고 한곳에서 catch 로 처리할 수 있다',
      '거래 내역을 List<Transaction> 으로 기록하고, 인터페이스로 시계를 주입해 DateTime 결과를 테스트 가능하게 만들 수 있다',
      'Dictionary 로 계좌를 찾고, 실패해도 돈이 사라지지 않는 이체를 구현할 수 있다',
      '추상 클래스 · virtual/override · 인터페이스로 계좌 종류마다 다른 규칙을 다형성으로 처리할 수 있다',
      'LINQ(GroupBy · SelectMany · Sum · MaxBy)로 은행 보고서를 만들 수 있다'
    ],
    requires: ['ch08', 'ch09', 'ch10', 'ch11'],
    preview: `=== C# 은행 (2025-03-03 11:20) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 5
계좌번호: 220-0002
[마이너스통장] 220-0002 이서연 잔액 -150,000원
  03-03 09:20  입금    +100,000  잔액    100,000  개설 입금
  03-03 10:10  출금    -450,000  잔액   -350,000  창구 출금
  03-03 10:40  입금    +200,000  잔액   -150,000  김민준님이 이체

=== C# 은행 (2025-03-03 11:40) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 8
계좌 3개 · 고객 3명
예금 합계 1,383,750원, 마이너스 합계 -150,000원
  저축예금: 2개, 잔액 합계 1,383,750원
  마이너스통장: 1개, 잔액 합계 -150,000원
  이자 2건, 합계 +33,750원
  입금 5건, 합계 +1,850,000원
  출금 2건, 합계 -650,000원
잔액 1위: 김민준 (110-0001) 871,250원`,
    sections: [
      /* =========================================================== 1교시 */
      {
        id: 'p02-1',
        title: '요구사항 분석과 설계',
        minutes: 50,
        goals: [
          '은행 계좌 프로그램의 기능과 규칙(불변 조건)을 정리할 수 있다',
          '공개 필드의 문제를 설명하고, private set 과 메서드로 잔액을 보호할 수 있다',
          'bool 반환 대신 사용자 정의 예외로 “왜 실패했는지” 를 알리는 설계를 할 수 있다',
          '돈 계산에 double 대신 decimal 을 쓰는 이유를 설명할 수 있다'
        ],
        flow: [['도입 · 완성품 시연', 5], ['요구사항 · 규칙', 8], ['클래스 설계', 10], ['캡슐화 · 예외 · decimal', 17], ['정리 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '무엇을 만들까? — 작은 은행' },
          { type: 'p', html: '이번 프로젝트는 <b>은행 계좌 관리 프로그램</b>입니다. 계좌를 만들고, 입금 · 출금 · 이체를 하고, 모든 거래를 내역으로 남기며, 계좌 종류(저축예금 · 마이너스통장)마다 다른 규칙을 적용합니다. P01 이 “데이터를 모아 계산하는” 프로그램이었다면, P02 는 <b>규칙을 지키는 객체</b>를 설계하는 연습입니다. 8~9장의 클래스 · 캡슐화 · 상속 · 인터페이스 · 다형성, 10장의 예외, 11장의 람다 · LINQ 를 모두 씁니다.' },
          { type: 'p', html: '<pre><code>=== C# 은행 (2025-03-03 11:20) ===\n1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료\n선택: 5\n계좌번호: 220-0002\n[마이너스통장] 220-0002 이서연 잔액 -150,000원\n  03-03 09:20  입금    +100,000  잔액    100,000  개설 입금\n  03-03 10:10  출금    -450,000  잔액   -350,000  창구 출금\n  03-03 10:40  입금    +200,000  잔액   -150,000  김민준님이 이체</code></pre>' },
          { type: 'h', text: '요구사항 — 기능과 규칙' },
          { type: 'table', caption: '기능 요구사항', head: ['메뉴', '기능', '설명'], rows: [
            ['1', '계좌 개설', '저축예금(연 2.5% 이자) 또는 마이너스통장(한도 100만 원). 계좌번호는 자동으로 붙인다'],
            ['2 / 3', '입금 / 출금', '계좌번호와 금액을 입력받아 처리한다'],
            ['4', '이체', '한 계좌에서 다른 계좌로 보낸다. 실패하면 두 계좌 모두 그대로'],
            ['5', '거래 내역', '계좌의 모든 거래를 시각 · 종류 · 금액 · 거래 후 잔액과 함께 보여 준다'],
            ['6', '계좌 목록', '모든 계좌와 종류별 정보(금리 · 한도 · 출금 가능 금액)'],
            ['7', '이자 지급', '이자가 붙는 계좌에만 이자를 넣는다'],
            ['8', '보고서', '예금 합계 · 종류별 합계 · 거래 유형별 합계 · 잔액 1위 (LINQ)']
          ] },
          { type: 'table', caption: '규칙 (불변 조건, invariant) — 어떤 경우에도 지켜져야 하는 것', head: ['규칙', '어기면'], rows: [
            ['입금 · 출금 · 이체 금액은 0보다 크다', '<code>InvalidAmountException</code>'],
            ['출금 가능 금액(저축: 잔액, 마이너스: 잔액 + 한도)을 넘게 뺄 수 없다', '<code>InsufficientFundsException</code>'],
            ['없는 계좌번호로 거래할 수 없다', '<code>AccountNotFoundException</code>'],
            ['잔액이 바뀌면 반드시 거래 내역이 하나 남는다', '— (구조로 보장: 잔액을 바꾸는 길을 하나로)'],
            ['이자는 원 단위 미만을 버린다', '—'],
            ['어떤 오류에도 프로그램은 멈추지 않고 안내 후 메뉴로 돌아간다', '—']
          ] },
          { type: 'callout', kind: 'tip', title: '불변 조건(invariant)이란?', html: '“잔액은 출금 가능 범위 안에 있다”, “잔액이 바뀌면 내역이 남는다” 처럼 <b>객체가 살아 있는 동안 언제나 참이어야 하는 조건</b>입니다. 클래스를 설계할 때는 먼저 불변 조건을 적고, <b>그 조건을 깨뜨릴 수 있는 길을 모두 막는 것</b>이 목표입니다. 이것이 캡슐화의 진짜 의미입니다.' },
          { type: 'h', text: '클래스 설계' },
          { type: 'figure', html: SVG_CLASS, caption: '클래스 설계 — 추상 클래스 Account 와 두 파생 계좌, 이자 인터페이스, 거래 내역, 시계 인터페이스, 은행' },
          { type: 'list', items: [
            '<b><code>Account</code></b>(추상) — 모든 계좌의 공통: 번호 · 주인 · 잔액 · 내역, 입금 · 출금의 흐름. 종류 이름(<code>KindName</code>)과 출금 가능 금액(<code>Available</code>)은 파생 클래스가 정한다',
            '<b><code>SavingsAccount</code></b>(저축예금) — 이자가 붙는다 → <code>IInterestBearing</code> 구현',
            '<b><code>CheckingAccount</code></b>(마이너스통장) — 한도만큼 잔액이 음수가 될 수 있다 → <code>Available</code> 재정의',
            '<b><code>Transaction</code></b> — 거래 한 건 (시각 · 종류 · 금액 · 거래 후 잔액 · 메모)',
            '<b><code>IClock</code></b> — “지금 몇 시?” 를 알려 주는 역할. 테스트할 때는 가짜 시계를 끼운다 (2교시)',
            '<b><code>Bank</code></b> — 계좌번호 → 계좌를 찾는 <code>Dictionary</code>, 개설과 이체'
          ] },
          { type: 'h', text: '예제로 설계 확인 ① — 잔액을 누가 바꿀 수 있나? (캡슐화)' },
          { type: 'p', html: '잔액을 <code>public</code> 필드로 두면 어느 코드든 <code>balance = -5000000</code> 처럼 규칙을 깨뜨릴 수 있습니다. 속성을 <b><code>{ get; private set; }</code></b> 로 만들면 밖에서는 <b>읽기만</b> 하고, 바꾸는 일은 규칙을 검사하는 <code>Deposit</code> · <code>Withdraw</code> 메서드만 할 수 있습니다.' },
          { type: 'code', title: '예제 P2-1. 공개 필드 vs 캡슐화된 계좌', code: `using System;

class BadAccount
{
    public decimal balance;                  // 누구나 마음대로 바꿀 수 있다
}

class Account
{
    public string Owner { get; }
    public decimal Balance { get; private set; }   // 밖에서는 읽기만

    public Account(string owner) { Owner = owner; }

    public bool Deposit(decimal amount)
    {
        if (amount <= 0) return false;
        Balance += amount;
        return true;
    }

    public bool Withdraw(decimal amount)
    {
        if (amount <= 0 || amount > Balance) return false;
        Balance -= amount;
        return true;
    }
}

class Program
{
    static void Main()
    {
        var bad = new BadAccount();
        bad.balance = -5000000;                  // 규칙 위반을 막을 방법이 없다
        Console.WriteLine($"BadAccount 잔액: {bad.balance:N0}원");

        var acc = new Account("김민준");
        Console.WriteLine($"입금 10,000 → {acc.Deposit(10000)}");
        Console.WriteLine($"입금 -500   → {acc.Deposit(-500)}");
        Console.WriteLine($"출금 30,000 → {acc.Withdraw(30000)}");
        Console.WriteLine($"출금 3,000  → {acc.Withdraw(3000)}");
        Console.WriteLine($"{acc.Owner} 잔액: {acc.Balance:N0}원");
        // acc.Balance = 1000000;   // 오류 CS0272: set 접근자에 접근할 수 없다 (private)
    }
}`, expect: `BadAccount 잔액: -5,000,000원
입금 10,000 → True
입금 -500   → False
출금 30,000 → False
출금 3,000  → True
김민준 잔액: 7,000원`, desc: '<code>{amount:N0}</code> 은 천 단위 쉼표가 있는 정수 형식입니다. 이제 잔액은 <code>Deposit</code> · <code>Withdraw</code> 를 거치지 않고는 바뀔 수 없습니다. 하지만 <code>false</code> 만 돌려주면 <b>왜</b> 실패했는지(금액이 틀렸는지, 잔액이 부족한지) 알 수 없습니다. 다음 예제에서 예외로 바꿉니다.' },
          { type: 'h', text: '예제로 설계 확인 ② — 실패를 예외로 알리기' },
          { type: 'p', html: '10장에서 <code>Exception</code> 을 상속해 예외를 직접 만들었습니다. 은행 규칙 위반을 모두 <b><code>BankException</code></b> 의 자식으로 만들면, 호출한 쪽은 필요에 따라 <b>구체적인 예외만</b> 골라 잡거나 <code>catch (BankException)</code> <b>하나로 모두</b> 잡을 수 있습니다. 예외 객체에 <code>Requested</code> · <code>Available</code> 같은 속성을 두면 “얼마가 모자란지” 같은 정보도 함께 전달됩니다.' },
          { type: 'figure', html: SVG_EXC, caption: '예외 계층 — BankException 을 부모로 세 가지 규칙 위반을 표현한다' },
          { type: 'code', title: '예제 P2-2. 사용자 정의 예외로 실패 이유 알리기', code: `using System;

${CS_EXC}

class Account
{
    public string Owner { get; }
    public decimal Balance { get; private set; }
    public Account(string owner) { Owner = owner; }

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new InvalidAmountException(amount);
        Balance += amount;
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0) throw new InvalidAmountException(amount);
        if (amount > Balance) throw new InsufficientFundsException(Balance, amount);
        Balance -= amount;
    }
}

class Program
{
    // 작업(람다)을 실행하고 결과를 알려 준다
    static void Try(string title, Action action)
    {
        try
        {
            action();
            Console.WriteLine($"{title}: 성공");
        }
        catch (InsufficientFundsException ex)          // 구체적인 예외 먼저
        {
            Console.WriteLine($"{title}: 실패 — {ex.Message} → {ex.Requested - ex.Available:N0}원 모자람");
        }
        catch (BankException ex)                        // 나머지 은행 예외
        {
            Console.WriteLine($"{title}: 실패 — {ex.Message}");
        }
    }

    static void Main()
    {
        var acc = new Account("김민준");
        Try("입금 50,000", () => acc.Deposit(50000));
        Try("입금 0", () => acc.Deposit(0));
        Try("출금 80,000", () => acc.Withdraw(80000));
        Try("출금 20,000", () => acc.Withdraw(20000));
        Console.WriteLine($"잔액: {acc.Balance:N0}원");
    }
}`, expect: `입금 50,000: 성공
입금 0: 실패 — 금액은 0보다 커야 합니다 (입력: 0원)
출금 80,000: 실패 — 잔액이 부족합니다 (출금 가능 50,000원, 요청 80,000원) → 30,000원 모자람
출금 20,000: 성공
잔액: 30,000원`, desc: '<code>Try</code> 는 할 일을 <code>Action</code>(11장, 매개변수 · 반환값 없는 델리게이트)으로 받아 실행합니다. <code>() =&gt; acc.Deposit(50000)</code> 은 “나중에 실행할 코드 조각” 입니다. catch 는 <b>자식 예외 먼저, 부모 예외 나중</b> 순서로 씁니다. 반대로 쓰면 CS0160 컴파일 오류입니다. 예외가 나면 <code>Balance -= amount</code> 까지 가지 않으므로 잔액은 안전합니다.' },
          { type: 'callout', kind: 'info', title: 'bool 반환 vs 예외 — 언제 무엇을?', html: '<b>자주, 정상적으로</b> 일어나는 실패(사용자가 숫자를 잘못 입력)는 <code>TryParse</code> 처럼 bool 로, <b>규칙 위반</b>이라 그냥 넘어가면 안 되는 실패(잔액 부족 출금)는 예외로 알립니다. bool 은 무시해도 컴파일되지만, 예외는 잡지 않으면 프로그램이 멈추므로 <b>무시할 수 없습니다</b>. 돈 문제는 무시하면 안 되겠죠.' },
          { type: 'h', text: '예제로 설계 확인 ③ — 돈은 decimal' },
          { type: 'p', html: '<code>double</code> 은 2진수로 소수를 저장하기 때문에 <code>0.1</code> 을 정확히 나타내지 못합니다. 과학 계산에는 문제가 없지만, 1원 오차도 허용되지 않는 돈 계산에는 10진수로 정확히 저장하는 <b><code>decimal</code></b> 을 씁니다(2장). decimal 리터럴에는 <code>m</code> 을 붙입니다.' },
          { type: 'code', title: '예제 P2-3. double 과 decimal 의 차이', code: `using System;

class Program
{
    static void Main()
    {
        double d = 0.1 + 0.2;
        decimal m = 0.1m + 0.2m;
        Console.WriteLine($"double : 0.1 + 0.2 = {d}  (0.3 과 같나? {d == 0.3})");
        Console.WriteLine($"decimal: 0.1 + 0.2 = {m}  (0.3 과 같나? {m == 0.3m})");

        double dSum = 0;
        decimal mSum = 0;
        for (int i = 0; i < 10; i++) { dSum += 0.1; mSum += 0.1m; }
        Console.WriteLine($"0.1 을 10번 더하기 → double {dSum}, decimal {mSum}");

        decimal balance = 1234567m;
        decimal rate = 0.025m;                         // 연 2.5%
        decimal raw = balance * rate;
        Console.WriteLine($"이자 계산 {balance:N0} × {rate:P1} = {raw}");
        Console.WriteLine($"원 단위 미만 버림: {Math.Floor(raw):N0}원");
    }
}`, expect: `double : 0.1 + 0.2 = 0.30000000000000004  (0.3 과 같나? False)
decimal: 0.1 + 0.2 = 0.3  (0.3 과 같나? True)
0.1 을 10번 더하기 → double 0.9999999999999999, decimal 1.0
이자 계산 1,234,567 × 2.5% = 30864.175
원 단위 미만 버림: 30,864원`, desc: 'double 의 결과가 0.3 이 아니라서 <code>==</code> 비교가 <b>False</b> 입니다. 반복해서 더하면 오차가 쌓입니다. decimal 은 정확합니다. <code>{rate:P1}</code> 은 백분율(×100, 소수 1자리) 형식, <code>Math.Floor</code> 는 내림입니다. 이 프로젝트의 모든 금액은 <code>decimal</code> 입니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 클래스 다이어그램 보기', html: 'Visual Studio 설치 관리자에서 <b>개별 구성 요소 → 클래스 디자이너</b>를 설치하면, 솔루션 탐색기에서 프로젝트를 오른쪽 클릭 → <b>보기 → 클래스 다이어그램 보기</b>로 지금 만든 클래스들의 상속 관계를 그림으로 볼 수 있습니다. 또 클래스 이름 위에서 <b>Ctrl+.</b> 을 누르면 “인터페이스 구현”, “추상 클래스 구현” 같은 빠른 작업으로 필요한 멤버의 뼈대를 자동으로 만들어 줍니다.' },
          { type: 'h', text: '구현 계획' },
          { type: 'table', head: ['교시', '단계', '내용'], rows: [
            ['2', '1 · 2 · 3', '거래 내역(List&lt;Transaction&gt;) · 시계 인터페이스(IClock) · Bank(Dictionary, 이체)'],
            ['3', '4 · 5 · 6', '추상 클래스 Account · 저축예금(IInterestBearing) · 마이너스통장(override) · 다형성'],
            ['4', '7 · 완성', 'LINQ 보고서 · 메뉴 프로그램 · 파일 분리 · 테스트 · 확장 과제']
          ] }
        ],
        practice: [
          {
            title: '실습 P2-1. 1회 출금 한도 규칙 추가',
            level: 2,
            desc: '<p>한 번에 100만 원을 넘게 출금할 수 없다는 규칙을 추가하세요. <code>BankException</code> 을 상속한 <code>LimitExceededException</code> 을 만들고, <code>Withdraw</code> 에서 한도를 넘으면 던집니다. 메시지: <code>1회 출금 한도 1,000,000원을 넘었습니다 (요청 1,500,000원)</code></p>',
            hint: '<code>const decimal MaxPerWithdraw = 1_000_000m;</code> 를 두고, 잔액 검사 <b>앞</b>에서 한도를 검사하세요. 생성자는 <code>: base($"…")</code> 로 메시지를 넘깁니다.',
            starter: `using System;

class BankException : Exception
{
    public BankException(string message) : base(message) { }
}

// TODO: LimitExceededException 만들기

class Account
{
    public const decimal MaxPerWithdraw = 1_000_000m;
    public decimal Balance { get; private set; }

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new BankException("금액 오류");
        Balance += amount;
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0) throw new BankException("금액 오류");
        // TODO: 1회 한도 검사
        if (amount > Balance) throw new BankException("잔액 부족");
        Balance -= amount;
    }
}

class Program
{
    static void Main()
    {
        var acc = new Account();
        acc.Deposit(3_000_000);
        decimal[] requests = { 1_500_000, 800_000, 1_000_000, 2_000_000 };
        foreach (decimal r in requests)
        {
            try
            {
                acc.Withdraw(r);
                Console.WriteLine($"{r:N0}원 출금 → 잔액 {acc.Balance:N0}원");
            }
            catch (BankException ex)
            {
                Console.WriteLine($"{ex.GetType().Name}: {ex.Message}");
            }
        }
    }
}
`,
            solution: `using System;

class BankException : Exception
{
    public BankException(string message) : base(message) { }
}

class LimitExceededException : BankException
{
    public LimitExceededException(decimal limit, decimal requested)
        : base($"1회 출금 한도 {limit:N0}원을 넘었습니다 (요청 {requested:N0}원)") { }
}

class Account
{
    public const decimal MaxPerWithdraw = 1_000_000m;
    public decimal Balance { get; private set; }

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new BankException("금액 오류");
        Balance += amount;
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0) throw new BankException("금액 오류");
        if (amount > MaxPerWithdraw) throw new LimitExceededException(MaxPerWithdraw, amount);
        if (amount > Balance) throw new BankException("잔액 부족");
        Balance -= amount;
    }
}

class Program
{
    static void Main()
    {
        var acc = new Account();
        acc.Deposit(3_000_000);
        decimal[] requests = { 1_500_000, 800_000, 1_000_000, 2_000_000 };
        foreach (decimal r in requests)
        {
            try
            {
                acc.Withdraw(r);
                Console.WriteLine($"{r:N0}원 출금 → 잔액 {acc.Balance:N0}원");
            }
            catch (BankException ex)
            {
                Console.WriteLine($"{ex.GetType().Name}: {ex.Message}");
            }
        }
    }
}`,
            expect: `LimitExceededException: 1회 출금 한도 1,000,000원을 넘었습니다 (요청 1,500,000원)
800,000원 출금 → 잔액 2,200,000원
1,000,000원 출금 → 잔액 1,200,000원
LimitExceededException: 1회 출금 한도 1,000,000원을 넘었습니다 (요청 2,000,000원)`
          },
          {
            title: '실습 P2-2. 명령 입력으로 입출금하기',
            level: 2,
            desc: '<p>한 줄에 하나씩 <code>+금액</code>(입금) 또는 <code>-금액</code>(출금)을 입력받아 처리하고 잔액을 보여 주세요. 빈 줄이면 끝냅니다. 숫자가 아니면 <code>숫자가 아닙니다: +abc</code>, 은행 예외는 <code>거절: 메시지</code> 로 알리고 계속합니다.</p><p>입력: <code>+50,000</code> · <code>-80000</code> · <code>+abc</code> · <code>-0</code> · <code>-20000</code> · 빈 줄</p>',
            hint: '<code>line[0]</code> 으로 부호를 보고, <code>decimal.TryParse(line.Substring(1), out decimal amount)</code>. decimal.TryParse 는 <code>50,000</code> 같은 쉼표도 받아들입니다.',
            starter: `using System;

${CS_EXC}

class Account
{
    public decimal Balance { get; private set; }
    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new InvalidAmountException(amount);
        Balance += amount;
    }
    public void Withdraw(decimal amount)
    {
        if (amount <= 0) throw new InvalidAmountException(amount);
        if (amount > Balance) throw new InsufficientFundsException(Balance, amount);
        Balance -= amount;
    }
}

class Program
{
    static void Main()
    {
        var acc = new Account();
        while (true)
        {
            Console.Write("명령(+금액/-금액): ");
            string line = (Console.ReadLine() ?? "").Trim();
            if (line == "") break;
            // TODO: 부호 확인 → TryParse → Deposit/Withdraw → 예외 처리
        }
        Console.WriteLine($"최종 잔액: {acc.Balance:N0}원");
    }
}
`,
            solution: `using System;

${CS_EXC}

class Account
{
    public decimal Balance { get; private set; }
    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new InvalidAmountException(amount);
        Balance += amount;
    }
    public void Withdraw(decimal amount)
    {
        if (amount <= 0) throw new InvalidAmountException(amount);
        if (amount > Balance) throw new InsufficientFundsException(Balance, amount);
        Balance -= amount;
    }
}

class Program
{
    static void Main()
    {
        var acc = new Account();
        while (true)
        {
            Console.Write("명령(+금액/-금액): ");
            string line = (Console.ReadLine() ?? "").Trim();
            if (line == "") break;
            if ((line[0] != '+' && line[0] != '-') || !decimal.TryParse(line.Substring(1), out decimal amount))
            {
                Console.WriteLine($"숫자가 아닙니다: {line}");
                continue;
            }
            try
            {
                if (line[0] == '+') acc.Deposit(amount);
                else acc.Withdraw(amount);
                Console.WriteLine($"처리 완료 → 잔액 {acc.Balance:N0}원");
            }
            catch (BankException ex)
            {
                Console.WriteLine($"거절: {ex.Message}");
            }
        }
        Console.WriteLine($"최종 잔액: {acc.Balance:N0}원");
    }
}`,
            stdin: '+50,000\n-80000\n+abc\n-0\n-20000\n\n',
            expect: `명령(+금액/-금액): 처리 완료 → 잔액 50,000원
명령(+금액/-금액): 거절: 잔액이 부족합니다 (출금 가능 50,000원, 요청 80,000원)
명령(+금액/-금액): 숫자가 아닙니다: +abc
명령(+금액/-금액): 거절: 금액은 0보다 커야 합니다 (입력: 0원)
명령(+금액/-금액): 처리 완료 → 잔액 30,000원
명령(+금액/-금액): 최종 잔액: 30,000원`
          }
        ],
        quiz: [
          { q: '<code>public decimal Balance { get; private set; }</code> 에 대한 설명으로 옳은 것은?', options: ['클래스 밖에서도 읽고 쓸 수 있다', '클래스 밖에서는 읽기만 할 수 있고, 값은 클래스 안에서만 바꿀 수 있다', '클래스 안에서도 바꿀 수 없다', '파생 클래스에서는 바꿀 수 있다'], answer: 1, explain: 'private set 은 선언한 클래스 안에서만 쓸 수 있습니다. 파생 클래스도 바꿀 수 없어서, 이 프로젝트는 protected 메서드 Change 를 통해서만 잔액을 바꾸게 합니다.' },
          { q: 'catch 블록 순서로 올바른 것은? (<code>InsufficientFundsException</code> 은 <code>BankException</code> 의 자식)', options: ['<code>catch (BankException)</code> → <code>catch (InsufficientFundsException)</code>', '<code>catch (InsufficientFundsException)</code> → <code>catch (BankException)</code>', '순서는 상관없다', '둘을 함께 쓸 수 없다'], answer: 1, explain: '위에서부터 처음 맞는 catch 하나만 실행됩니다. 부모를 먼저 쓰면 자식 catch 에 도달할 수 없어 CS0160 오류가 납니다.' },
          { q: '다음 코드의 출력은?<pre><code>double d = 0.1 + 0.2;\ndecimal m = 0.1m + 0.2m;\nConsole.WriteLine($"{d == 0.3} {m == 0.3m}");</code></pre>', options: ['True True', 'False True', 'True False', 'False False'], answer: 1, explain: 'double 은 0.1 을 정확히 저장하지 못해 0.30000000000000004 가 됩니다. decimal 은 10진수로 정확합니다.' },
          { q: '출금 실패를 <code>bool</code> 대신 예외로 알릴 때의 장점이 <b>아닌</b> 것은?', options: ['실패 이유를 예외 형식과 메시지로 알 수 있다', '잡지 않으면 프로그램이 멈추므로 실수로 무시하기 어렵다', '모자란 금액 같은 추가 정보를 속성으로 전달할 수 있다', '실행 속도가 항상 더 빠르다'], answer: 3, explain: '예외는 던지고 잡는 비용이 커서 bool 보다 느립니다. 그래서 자주 일어나는 일반적인 실패에는 TryParse 같은 방식을 씁니다.' },
          { q: '<code>1234567m * 0.025m</code> 의 결과 30864.175 에 <code>Math.Floor</code> 를 적용하면?', options: ['30864', '30865', '30864.2', '30864.18'], answer: 0, explain: 'Math.Floor 는 작거나 같은 가장 큰 정수(내림)입니다. 반올림은 Math.Round 입니다.' }
        ],
        slides: [
          { layout: 'title', title: '요구사항 분석과 설계', subtitle: 'Project 02 · 은행 계좌 관리 (클래스) — 1교시', badge: 'P02-1',
            notes: '<p><b>[도입 3분]</b> 4교시 완성 프로그램을 시연합니다: 계좌 개설 → 입금 → 마이너스 출금 → 이체 → 잔액 부족 오류 → 내역 → 이자 → 보고서.</p><p>발문: “은행 프로그램에서 절대 일어나면 안 되는 일은?” → 돈이 사라짐, 잔액이 음수, 내역 없는 잔액 변화 … 이것이 오늘 정리할 “규칙” 입니다.</p>' },
          { layout: 'bullets', title: '무엇을 만들까?', lead: '규칙을 지키는 객체를 설계한다',
            bullets: ['계좌 개설: 저축예금 · 마이너스통장', '입금 · 출금 · 이체 (실패해도 돈이 안 사라짐)', '모든 거래를 내역으로 기록 (시각 포함)', '이자 지급 — 이자 붙는 계좌만', 'LINQ 보고서'],
            notes: '<p><b>[3분]</b> P01 과 비교: P01 은 “데이터를 모아 계산”, P02 는 “규칙을 지키는 객체”. 8~9장 내용을 한꺼번에 쓰는 프로젝트라는 것을 알려 줍니다.</p>' },
          { layout: 'table', title: '규칙 (불변 조건)', head: ['규칙', '어기면'], rows: [['금액 &gt; 0', 'InvalidAmountException'], ['출금 ≤ 출금 가능 금액', 'InsufficientFundsException'], ['있는 계좌만 거래', 'AccountNotFoundException'], ['잔액 변화 = 내역 1건', '구조로 보장'], ['어떤 오류에도 멈추지 않음', 'catch 한곳에서']],
            lead: '불변 조건 = 언제나 참이어야 하는 것',
            notes: '<p><b>[5분]</b> “잔액 변화 = 내역 1건” 은 예외로 막는 규칙이 아니라 <b>설계로</b> 보장하는 규칙입니다: 잔액을 바꾸는 코드를 한 메서드(Change)로 모으면 내역을 빠뜨릴 수 없다.</p>' },
          { layout: 'diagram', title: '클래스 설계', html: SVG_CLASS, caption: '추상 Account · 파생 계좌 두 개 · 인터페이스 두 개 · Transaction · Bank',
            notes: '<p><b>[7분]</b> 위에서 아래로: Bank 는 여러 Account 를 가진다. Account 는 Transaction 을 기록하고 IClock 에게 시각을 묻는다. 아래는 상속(실선 삼각형)과 인터페이스 구현(점선).</p><p>발문: “저축예금과 마이너스통장의 공통점과 차이점은?” → 공통은 Account 에, 차이는 파생 클래스에.</p>' },
          { layout: 'two', title: '공개 필드 vs 캡슐화', left: { title: '✗ 공개 필드', code: `class BadAccount
{
    public decimal balance;
}
// 어디서든:
bad.balance = -5000000;`, run: false }, right: { title: '✔ private set + 메서드', code: `class Account
{
    public decimal Balance { get; private set; }
    public void Withdraw(decimal amount)
    {
        if (amount > Balance) throw ...;
        Balance -= amount;
    }
}`, run: false },
            notes: '<p><b>[4분]</b> 예제 P2-1 을 실행해 보여 준 뒤 <code>acc.Balance = 1000000;</code> 줄의 주석을 풀어 CS0272 컴파일 오류를 확인합니다. “컴파일러가 규칙을 지켜 준다.”</p>' },
          { layout: 'diagram', title: '예외 계층 설계', html: SVG_EXC, caption: 'BankException 하나로 모두, 또는 구체적인 것만 골라 잡기',
            notes: '<p><b>[3분]</b> 10장 예외 계층 그림(Exception → ArgumentException …)과 같은 구조를 우리가 직접 만든다는 점을 강조합니다.</p>' },
          { layout: 'code', title: '예제 P2-2. 사용자 정의 예외', code: `using System;

class BankException : Exception
{
    public BankException(string msg) : base(msg) { }
}
class InsufficientFundsException : BankException
{
    public decimal Shortage { get; }
    public InsufficientFundsException(decimal shortage)
        : base($"잔액 부족 ({shortage:N0}원 모자람)") { Shortage = shortage; }
}

class Program
{
    static decimal balance = 50000;
    static void Withdraw(decimal amount)
    {
        if (amount > balance) throw new InsufficientFundsException(amount - balance);
        balance -= amount;
    }
    static void Main()
    {
        try { Withdraw(20000); Withdraw(80000); }
        catch (InsufficientFundsException ex) { Console.WriteLine(ex.Message); }
        catch (BankException ex) { Console.WriteLine("기타: " + ex.Message); }
        Console.WriteLine($"잔액 {balance:N0}원");
    }
}`, points: ['<code>: BankException</code> 으로 계층 만들기', '<code>: base(메시지)</code>', '예외에 속성으로 정보 담기', '자식 catch 먼저'],
            notes: '<p><b>[5분]</b> 두 번째 Withdraw 에서 예외 → balance 는 30,000 그대로. catch 순서를 바꿔 CS0160 을 보여 주세요.</p>' },
          { layout: 'code', title: '예제 P2-3. 돈은 decimal', code: `using System;

class Program
{
    static void Main()
    {
        double d = 0.1 + 0.2;
        decimal m = 0.1m + 0.2m;
        Console.WriteLine($"double  {d}");
        Console.WriteLine($"decimal {m}");

        decimal interest = 1234567m * 0.025m;
        Console.WriteLine($"{interest} → {Math.Floor(interest):N0}원");
    }
}`, points: ['double: 2진수 → 0.1 도 오차', 'decimal: 10진수 → 정확 (리터럴 <code>m</code>)', '<code>Math.Floor</code> 원 미만 버림'],
            notes: '<p><b>[4분]</b> “은행 앱에서 0.00000000000000004 원 차이가 매일 수백만 건 쌓인다면?” — 실제로 금융 시스템은 decimal(또는 정수 원 단위)을 씁니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'Account 밖에서 <code>acc.Balance = 1000;</code> 을 쓰면? (<code>Balance { get; private set; }</code>)', options: ['잔액이 1000 이 된다', '실행 중 예외', '컴파일 오류 CS0272', '무시된다'], answer: 2, explain: 'private set 은 클래스 밖에서 쓸 수 없으므로 컴파일 단계에서 막힙니다.',
            notes: '<p><b>[2분]</b> 실행 중 예외보다 컴파일 오류가 훨씬 좋은 이유: 프로그램을 배포하기 전에 발견되니까.</p>' },
          { layout: 'practice', title: '실습 P2-1. 1회 출금 한도', desc: '<code>LimitExceededException : BankException</code> 을 만들고 100만 원 초과 출금을 막기', starter: `using System;

class BankException : Exception
{
    public BankException(string m) : base(m) { }
}
// TODO: LimitExceededException

class Program
{
    static decimal balance = 3_000_000;
    static void Withdraw(decimal amount)
    {
        // TODO: 1,000,000 초과면 LimitExceededException
        balance -= amount;
    }
    static void Main()
    {
        try { Withdraw(800_000); Withdraw(1_500_000); }
        catch (BankException ex) { Console.WriteLine($"{ex.GetType().Name}: {ex.Message}"); }
        Console.WriteLine($"잔액 {balance:N0}원");
    }
}`, solution: `using System;

class BankException : Exception
{
    public BankException(string m) : base(m) { }
}
class LimitExceededException : BankException
{
    public LimitExceededException(decimal req)
        : base($"1회 출금 한도 1,000,000원을 넘었습니다 (요청 {req:N0}원)") { }
}

class Program
{
    static decimal balance = 3_000_000;
    static void Withdraw(decimal amount)
    {
        if (amount > 1_000_000) throw new LimitExceededException(amount);
        balance -= amount;
    }
    static void Main()
    {
        try { Withdraw(800_000); Withdraw(1_500_000); }
        catch (BankException ex) { Console.WriteLine($"{ex.GetType().Name}: {ex.Message}"); }
        Console.WriteLine($"잔액 {balance:N0}원");
    }
}`,
            notes: '<p><b>[실습 안내]</b> 한도 검사를 잔액 검사 <b>앞</b>에 두는 이유를 물어보세요: 잔액이 충분해도 한도는 지켜야 하니까. 빠른 학생은 실습 P2-2(명령 입력)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['요구사항 = 기능 + <b>불변 조건</b>', '<code>{ get; private set; }</code> + 메서드로 잔액 보호', '규칙 위반은 <code>BankException</code> 계층의 예외로', 'catch 는 자식 먼저, 부모 나중', '돈은 <code>decimal</code>, 원 미만은 <code>Math.Floor</code>'],
            notes: '<p>다음 시간: 거래 내역과 “시간” 문제, 그리고 Bank · 이체. DateTime.Now 가 왜 테스트를 어렵게 하는지 직접 봅니다.</p>' }
        ]
      },

      /* =========================================================== 2교시 */
      {
        id: 'p02-2',
        title: '단계별 구현 ① — 거래 내역 · 시계 · 이체',
        minutes: 50,
        goals: [
          '거래를 Transaction 객체로 만들어 List 에 기록하고, 밖에는 IReadOnlyList 로만 공개할 수 있다',
          'DateTime.Now 가 결과를 매번 다르게 만드는 문제를 이해하고, IClock 인터페이스로 시각을 주입할 수 있다',
          'Dictionary<string, Account> 와 TryGetValue 로 계좌를 찾고, 없으면 예외를 던질 수 있다',
          '실패해도 두 계좌가 그대로인 이체를 설계할 수 있다'
        ],
        flow: [['복습 · 목표', 3], ['단계 1: 거래 내역', 10], ['단계 2: 시계 주입', 12], ['단계 3: Bank · 이체', 15], ['실습 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '단계 1. 거래 내역 기록하기' },
          { type: 'p', html: '거래 한 건은 <b>시각 · 종류 · 금액 · 거래 후 잔액 · 메모</b>로 이루어집니다. 이것을 <code>Transaction</code> 클래스로 만들고, 계좌는 <code>List&lt;Transaction&gt;</code> 에 쌓아 둡니다. 금액은 들어오면 <b>+</b>, 나가면 <b>−</b> 로 저장하면 나중에 LINQ <code>Sum</code> 으로 합계를 내기 쉽습니다.' },
          { type: 'p', html: '중요한 설계: 잔액을 바꾸는 코드를 <b><code>Change</code> 메서드 하나</b>에 모으고, 그 안에서 반드시 내역을 추가합니다. 그러면 “잔액은 바뀌었는데 내역이 없는” 상황이 구조적으로 불가능해집니다. 목록은 <code>private</code> 으로 두고 밖에는 <b><code>IReadOnlyList&lt;Transaction&gt;</code></b> 로만 보여 주어, 밖에서 내역을 지우거나 끼워 넣지 못하게 합니다.' },
          { type: 'code', title: '단계 1. 거래 내역 — DateTime.Now 로 시각 기록 (실행할 때마다 다름)', nondeterministic: true, code: `using System;
using System.Collections.Generic;

${CS_EXC}

${CS_TX}

class Account
{
    private readonly List<Transaction> history = new List<Transaction>();
    public string Owner { get; }
    public decimal Balance { get; private set; }
    public IReadOnlyList<Transaction> History => history;     // 읽기 전용으로만 공개

    public Account(string owner) { Owner = owner; }

    public void Deposit(decimal amount, string memo = "")
    {
        if (amount <= 0) throw new InvalidAmountException(amount);
        Change(amount, "입금", memo);
    }

    public void Withdraw(decimal amount, string memo = "")
    {
        if (amount <= 0) throw new InvalidAmountException(amount);
        if (amount > Balance) throw new InsufficientFundsException(Balance, amount);
        Change(-amount, "출금", memo);
    }

    private void Change(decimal delta, string kind, string memo)
    {
        Balance += delta;
        history.Add(new Transaction(DateTime.Now, kind, delta, Balance, memo));   // 지금 시각
    }
}

class Program
{
    static void Main()
    {
        var acc = new Account("김민준");
        acc.Deposit(100000, "용돈");
        acc.Withdraw(25000, "점심");
        acc.Deposit(50000, "아르바이트");

        Console.WriteLine($"{acc.Owner} 잔액 {acc.Balance:N0}원, 거래 {acc.History.Count}건");
        foreach (Transaction t in acc.History)
            Console.WriteLine("  " + t);
        // acc.History.Add(...);   // 오류: IReadOnlyList 에는 Add 가 없다
    }
}`, desc: '실행해 보면 거래 시각이 <b>지금 이 순간</b>으로 찍힙니다. 그래서 이 예제는 실행할 때마다 결과가 다르며, 자동 검증에서 “정답 출력” 을 정할 수 없습니다(<code>nondeterministic</code>). <code>{Amount,10:+#,0;-#,0}</code> 은 <b>양수;음수</b> 두 구역으로 된 사용자 지정 형식으로, 양수 앞에 <code>+</code> 를 붙입니다.' },
          { type: 'callout', kind: 'warn', title: 'DateTime.Now 는 테스트의 적', html: '<code>DateTime.Now</code> 를 코드 곳곳에서 직접 부르면 ① 결과를 미리 알 수 없어 자동 테스트를 못 하고, ② “자정이 지나면 이자가 붙는지”, “월말 처리” 같은 기능을 확인하려면 <b>진짜로 그 시각까지 기다려야</b> 합니다. 난수(<code>new Random()</code>)도 같은 문제가 있습니다. 해결책은 “시각을 알려 주는 역할” 을 밖에서 넣어 주는 것입니다.' },
          { type: 'h', text: '단계 2. 시계를 인터페이스로 주입하기' },
          { type: 'p', html: '“지금 몇 시인가?” 를 알려 주는 역할을 <b>인터페이스 <code>IClock</code></b> 으로 정의하고, 계좌는 생성자로 받은 시계에게만 시각을 묻습니다. 실제 프로그램에는 <code>DateTime.Now</code> 를 돌려주는 <code>SystemClock</code> 을, 테스트에는 우리가 정한 시각에서 출발해 <code>Advance</code> 로 직접 흘려보내는 <code>FakeClock</code> 을 넣습니다. 계좌 코드는 <b>어느 시계인지 모른 채</b> <code>clock.Now</code> 만 부릅니다 — 9장 인터페이스와 다형성입니다.' },
          { type: 'code', title: '단계 2. IClock 주입 — 테스트용 시계로 결과 고정하기', code: `using System;
using System.Collections.Generic;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNT_BASIC}

class Program
{
    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));    // 3월 3일 오전 9시에서 시작
        var acc = new Account("100-0001", "김민준", clock);

        acc.Deposit(100000, "용돈");
        clock.Advance(TimeSpan.FromHours(3));                               // 3시간 뒤
        acc.Withdraw(25000, "점심");
        clock.Advance(TimeSpan.FromDays(1));                                // 다음 날
        try
        {
            acc.Withdraw(80000, "운동화");
        }
        catch (BankException ex)
        {
            Console.WriteLine($"[{clock.Now:MM-dd HH:mm}] 실패: {ex.Message}");
        }
        acc.Deposit(50000, "아르바이트");

        Console.WriteLine($"{acc.Number} {acc.Owner} 잔액 {acc.Balance:N0}원");
        foreach (Transaction t in acc.History)
            Console.WriteLine("  " + t);
    }
}`, expect: `[03-04 12:00] 실패: 잔액이 부족합니다 (출금 가능 75,000원, 요청 80,000원)
100-0001 김민준 잔액 125,000원
  03-03 09:00  입금    +100,000  잔액    100,000  용돈
  03-03 12:00  출금     -25,000  잔액     75,000  점심
  03-04 12:00  입금     +50,000  잔액    125,000  아르바이트`, desc: '이제 결과가 언제 실행해도 같습니다. 실패한 출금(운동화)은 예외가 <code>Change</code> 전에 나므로 <b>내역에 남지 않습니다</b>. <code>clock.Advance(TimeSpan.FromDays(1))</code> 로 하루를 1초 만에 흘려보낼 수 있으니 “다음 날” 에 일어나는 일도 바로 시험할 수 있습니다.' },
          { type: 'callout', kind: 'info', title: '의존성 주입(Dependency Injection)', html: '객체가 필요로 하는 것(여기서는 시계)을 <b>스스로 만들지 않고 밖에서 받는</b> 설계를 의존성 주입이라고 합니다. <code>Account</code> 는 <code>new SystemClock()</code> 을 직접 쓰지 않고 생성자 매개변수 <code>IClock clock</code> 으로 받습니다. 덕분에 코드를 한 줄도 바꾸지 않고 진짜 시계 ↔ 테스트 시계를 갈아 끼울 수 있습니다. WPF 의 MVVM(20장)과 실무 ASP.NET 에서 매우 많이 쓰는 기법입니다.' },
          { type: 'h', text: '단계 3. 은행(Bank) — Dictionary 로 계좌 찾기와 이체' },
          { type: 'p', html: '계좌번호로 계좌를 빨리 찾으려면 <b><code>Dictionary&lt;string, Account&gt;</code></b>(7장)가 알맞습니다. 키가 계좌번호, 값이 계좌 객체입니다. <code>TryGetValue</code> 로 찾고, 없으면 <code>AccountNotFoundException</code> 을 던집니다. 계좌번호는 은행이 <code>"100-0001"</code> 처럼 차례로 붙여 줍니다(<code>{seq:D4}</code> = 4자리, 앞을 0 으로 채움).' },
          { type: 'figure', html: SVG_TRANSFER, caption: '이체의 순서 — 검사가 필요한 일을 먼저, 입금은 마지막에. 중간에 예외가 나면 입금까지 가지 않는다' },
          { type: 'code', title: '단계 3. Bank — 계좌 개설 · 찾기 · 이체', code: `using System;
using System.Collections.Generic;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNT_BASIC}

class Bank
{
    private readonly Dictionary<string, Account> accounts = new Dictionary<string, Account>();
    private readonly IClock clock;
    private int seq = 0;

    public Bank(IClock clock) { this.clock = clock; }

    public IEnumerable<Account> Accounts => accounts.Values;

    public Account Open(string owner, decimal initial)
    {
        var acc = new Account($"100-{++seq:D4}", owner, clock);
        accounts.Add(acc.Number, acc);
        if (initial > 0) acc.Deposit(initial, "개설 입금");
        return acc;
    }

    public Account Find(string number)
    {
        if (accounts.TryGetValue(number, out Account? acc)) return acc;
        throw new AccountNotFoundException(number);
    }

    public void Transfer(string fromNo, string toNo, decimal amount)
    {
        Account from = Find(fromNo);
        Account to = Find(toNo);
        if (from == to) throw new BankException("같은 계좌로는 이체할 수 없습니다");
        from.Withdraw(amount, $"{to.Owner}님께 이체");     // 실패하면 여기서 예외 → 입금은 일어나지 않는다
        to.Deposit(amount, $"{from.Owner}님이 이체");
    }
}

class Program
{
    static readonly FakeClock clock = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));
    static readonly Bank bank = new Bank(clock);

    static void TryTransfer(string from, string to, decimal amount)
    {
        clock.Advance(TimeSpan.FromMinutes(10));
        try
        {
            bank.Transfer(from, to, amount);
            Console.WriteLine($"이체 성공: {from} → {to} {amount:N0}원");
        }
        catch (BankException ex)
        {
            Console.WriteLine($"이체 실패: {ex.Message}");
        }
    }

    static void Main()
    {
        Account a = bank.Open("김민준", 100000);
        Account b = bank.Open("이서연", 20000);
        Console.WriteLine($"개설: {a.Number} {a.Owner}, {b.Number} {b.Owner}");

        TryTransfer("100-0001", "100-0002", 30000);
        TryTransfer("100-0002", "100-0001", 100000);    // 잔액 부족
        TryTransfer("100-0001", "999-9999", 1000);      // 없는 계좌
        TryTransfer("100-0001", "100-0001", 1000);      // 같은 계좌
        TryTransfer("100-0001", "100-0002", -5000);     // 잘못된 금액

        foreach (Account acc in bank.Accounts)
        {
            Console.WriteLine($"{acc.Number} {acc.Owner} 잔액 {acc.Balance:N0}원");
            foreach (Transaction t in acc.History)
                Console.WriteLine("  " + t);
        }
    }
}`, expect: `개설: 100-0001 김민준, 100-0002 이서연
이체 성공: 100-0001 → 100-0002 30,000원
이체 실패: 잔액이 부족합니다 (출금 가능 50,000원, 요청 100,000원)
이체 실패: 계좌를 찾을 수 없습니다: 999-9999
이체 실패: 같은 계좌로는 이체할 수 없습니다
이체 실패: 금액은 0보다 커야 합니다 (입력: -5,000원)
100-0001 김민준 잔액 70,000원
  03-03 09:00  입금    +100,000  잔액    100,000  개설 입금
  03-03 09:10  출금     -30,000  잔액     70,000  이서연님께 이체
100-0002 이서연 잔액 50,000원
  03-03 09:00  입금     +20,000  잔액     20,000  개설 입금
  03-03 09:10  입금     +30,000  잔액     50,000  김민준님이 이체`, desc: '다섯 번의 이체 중 하나만 성공했고, 실패한 네 번은 <b>어느 계좌에도 흔적을 남기지 않았습니다</b>. 이체 순서가 “찾기 → 검사 → 출금 → 입금” 이라서, 예외가 나는 지점 뒤의 일은 실행되지 않기 때문입니다. <code>out Account? acc</code> 의 <code>?</code> 는 “못 찾으면 null 이 들어갈 수 있음” 표시입니다.' },
          { type: 'callout', kind: 'warn', title: '순서를 바꾸면 돈이 생긴다', html: '만약 <code>to.Deposit</code> 을 먼저 하고 <code>from.Withdraw</code> 를 나중에 하면? 받는 쪽 입금은 성공했는데 보내는 쪽 출금이 잔액 부족으로 실패 → <b>은행이 돈을 만들어 낸</b> 셈입니다. 여러 단계로 된 작업은 “전부 성공하거나 전부 실패” 해야 합니다(원자성, atomicity). 데이터베이스에서는 이것을 <b>트랜잭션</b>이 보장해 줍니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 예외가 난 곳 따라가기', html: '<b>디버그 → 창 → 예외 설정</b>(Ctrl+Alt+E)에서 <b>Common Language Runtime Exceptions</b> 를 체크하면, catch 로 잡히는 예외라도 <b>던져지는 순간</b> 멈춥니다. 이체 실패 때 어느 줄에서 예외가 났는지 확인하고, <b>호출 스택</b> 창으로 <code>Main → TryTransfer → Transfer → Withdraw</code> 경로를 따라가 보세요.' }
        ],
        practice: [
          {
            title: '실습 P2-3. 기간별 거래 조회',
            level: 2,
            desc: '<p>테스트 시계로 3일 동안 거래를 만든 뒤, <b>3월 4일 하루</b>의 거래만 골라 출력하고 그날의 입금 합계 · 출금 합계를 구하세요.</p><pre><code>[03-04 거래]\n  03-04 10:00  출금 ...\n입금 합계 +…원, 출금 합계 -…원</code></pre>',
            hint: '<code>acc.History.Where(t =&gt; t.Date.Date == day)</code> — <code>Date</code> 속성의 <code>.Date</code> 는 시각을 뗀 날짜만. 합계는 <code>Where(t =&gt; t.Amount &gt; 0).Sum(t =&gt; t.Amount)</code>.',
            starter: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNT_BASIC}

class Program
{
    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));
        var acc = new Account("100-0001", "김민준", clock);
        acc.Deposit(200000, "월급");
        clock.Advance(TimeSpan.FromHours(25));      // 03-04 10:00
        acc.Withdraw(15000, "교통카드");
        clock.Advance(TimeSpan.FromHours(3));       // 03-04 13:00
        acc.Withdraw(9000, "점심");
        clock.Advance(TimeSpan.FromHours(5));       // 03-04 18:00
        acc.Deposit(30000, "용돈");
        clock.Advance(TimeSpan.FromDays(1));        // 03-05 18:00
        acc.Withdraw(40000, "책");

        DateTime day = new DateTime(2025, 3, 4);
        // TODO: day 의 거래만 출력하고 입금 · 출금 합계 구하기
        Console.WriteLine($"전체 거래 {acc.History.Count}건, 기준일 {day:MM-dd}");
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNT_BASIC}

class Program
{
    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));
        var acc = new Account("100-0001", "김민준", clock);
        acc.Deposit(200000, "월급");
        clock.Advance(TimeSpan.FromHours(25));      // 03-04 10:00
        acc.Withdraw(15000, "교통카드");
        clock.Advance(TimeSpan.FromHours(3));       // 03-04 13:00
        acc.Withdraw(9000, "점심");
        clock.Advance(TimeSpan.FromHours(5));       // 03-04 18:00
        acc.Deposit(30000, "용돈");
        clock.Advance(TimeSpan.FromDays(1));        // 03-05 18:00
        acc.Withdraw(40000, "책");

        DateTime day = new DateTime(2025, 3, 4);
        var daily = acc.History.Where(t => t.Date.Date == day).ToList();
        Console.WriteLine($"[{day:MM-dd} 거래]");
        foreach (Transaction t in daily)
            Console.WriteLine("  " + t);
        decimal inSum = daily.Where(t => t.Amount > 0).Sum(t => t.Amount);
        decimal outSum = daily.Where(t => t.Amount < 0).Sum(t => t.Amount);
        Console.WriteLine($"입금 합계 {inSum:+#,0;-#,0;0}원, 출금 합계 {outSum:+#,0;-#,0;0}원");
    }
}`,
            expect: `[03-04 거래]
  03-04 10:00  출금     -15,000  잔액    185,000  교통카드
  03-04 13:00  출금      -9,000  잔액    176,000  점심
  03-04 18:00  입금     +30,000  잔액    206,000  용돈
입금 합계 +30,000원, 출금 합계 -24,000원`
          },
          {
            title: '실습 P2-4. 이체 수수료 — 반쯤 성공은 없다',
            level: 3,
            desc: '<p><code>Bank.Transfer</code> 에 규칙을 추가하세요: <b>주인이 다른</b> 계좌로 보낼 때는 수수료 500원을 따로 출금합니다(메모 <code>이체 수수료</code>). 보내는 금액 + 수수료가 잔액보다 크면 <b>아무것도 출금하지 않고</b> <code>InsufficientFundsException</code> 을 던져야 합니다.</p><p>잔액 10,000원에서 9,800원을 보내면? → 금액은 되지만 수수료까지는 안 됨 → 전부 실패해야 합니다.</p>',
            hint: '출금을 두 번(금액, 수수료) 하기 <b>전에</b> <code>amount + fee &gt; from.Balance</code> 를 먼저 검사하세요. 그렇지 않으면 첫 출금은 성공하고 수수료 출금만 실패하는 “반쯤 성공” 이 생깁니다.',
            starter: `using System;
using System.Collections.Generic;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNT_BASIC}

class Bank
{
    public const decimal Fee = 500;
    private readonly Dictionary<string, Account> accounts = new Dictionary<string, Account>();

    public void Add(Account acc) => accounts.Add(acc.Number, acc);

    public Account Find(string number) =>
        accounts.TryGetValue(number, out Account? acc) ? acc : throw new AccountNotFoundException(number);

    public void Transfer(string fromNo, string toNo, decimal amount)
    {
        Account from = Find(fromNo);
        Account to = Find(toNo);
        // TODO: 주인이 다르면 수수료. 금액 + 수수료를 먼저 검사한 뒤 출금 두 번
        from.Withdraw(amount, $"{to.Owner}님께 이체");
        to.Deposit(amount, $"{from.Owner}님이 이체");
    }
}

class Program
{
    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));
        var bank = new Bank();
        var a1 = new Account("100-0001", "김민준", clock);
        var a2 = new Account("100-0002", "김민준", clock);
        var b = new Account("100-0003", "이서연", clock);
        bank.Add(a1); bank.Add(a2); bank.Add(b);
        a1.Deposit(10000);

        string[][] plans = { new[] { "100-0001", "100-0002", "3000" },     // 같은 주인 → 수수료 없음
                             new[] { "100-0001", "100-0003", "2000" },     // 다른 주인 → 수수료 500
                             new[] { "100-0001", "100-0003", "4800" } };   // 4800 + 500 > 5000 → 전부 실패
        foreach (string[] p in plans)
        {
            try
            {
                bank.Transfer(p[0], p[1], decimal.Parse(p[2]));
                Console.WriteLine($"성공: {p[0]} → {p[1]} {decimal.Parse(p[2]):N0}원");
            }
            catch (BankException ex) { Console.WriteLine($"실패: {ex.Message}"); }
            Console.WriteLine($"  잔액 {a1.Balance:N0} / {a2.Balance:N0} / {b.Balance:N0}");
        }
    }
}
`,
            solution: `using System;
using System.Collections.Generic;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNT_BASIC}

class Bank
{
    public const decimal Fee = 500;
    private readonly Dictionary<string, Account> accounts = new Dictionary<string, Account>();

    public void Add(Account acc) => accounts.Add(acc.Number, acc);

    public Account Find(string number) =>
        accounts.TryGetValue(number, out Account? acc) ? acc : throw new AccountNotFoundException(number);

    public void Transfer(string fromNo, string toNo, decimal amount)
    {
        Account from = Find(fromNo);
        Account to = Find(toNo);
        decimal fee = from.Owner == to.Owner ? 0 : Fee;
        if (amount <= 0) throw new InvalidAmountException(amount);
        if (amount + fee > from.Balance)                        // 모두 할 수 있는지 먼저 확인
            throw new InsufficientFundsException(from.Balance, amount + fee);
        from.Withdraw(amount, $"{to.Owner}님께 이체");
        if (fee > 0) from.Withdraw(fee, "이체 수수료");
        to.Deposit(amount, $"{from.Owner}님이 이체");
    }
}

class Program
{
    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));
        var bank = new Bank();
        var a1 = new Account("100-0001", "김민준", clock);
        var a2 = new Account("100-0002", "김민준", clock);
        var b = new Account("100-0003", "이서연", clock);
        bank.Add(a1); bank.Add(a2); bank.Add(b);
        a1.Deposit(10000);

        string[][] plans = { new[] { "100-0001", "100-0002", "3000" },     // 같은 주인 → 수수료 없음
                             new[] { "100-0001", "100-0003", "2000" },     // 다른 주인 → 수수료 500
                             new[] { "100-0001", "100-0003", "4800" } };   // 4800 + 500 > 5000 → 전부 실패
        foreach (string[] p in plans)
        {
            try
            {
                bank.Transfer(p[0], p[1], decimal.Parse(p[2]));
                Console.WriteLine($"성공: {p[0]} → {p[1]} {decimal.Parse(p[2]):N0}원");
            }
            catch (BankException ex) { Console.WriteLine($"실패: {ex.Message}"); }
            Console.WriteLine($"  잔액 {a1.Balance:N0} / {a2.Balance:N0} / {b.Balance:N0}");
        }
    }
}`,
            expect: `성공: 100-0001 → 100-0002 3,000원
  잔액 7,000 / 3,000 / 0
성공: 100-0001 → 100-0003 2,000원
  잔액 4,500 / 3,000 / 2,000
실패: 잔액이 부족합니다 (출금 가능 4,500원, 요청 5,300원)
  잔액 4,500 / 3,000 / 2,000`
          }
        ],
        quiz: [
          { q: '<code>public IReadOnlyList&lt;Transaction&gt; History =&gt; history;</code> 로 공개했을 때 클래스 밖에서 할 수 <b>없는</b> 것은?', options: ['<code>History.Count</code> 읽기', '<code>History[0]</code> 읽기', '<code>foreach</code> 로 돌기', '<code>History.Add(…)</code> 로 추가하기'], answer: 3, explain: 'IReadOnlyList 에는 읽기용 멤버(Count, 인덱서, 열거)만 있고 Add · Remove 가 없습니다.' },
          { q: '<code>DateTime.Now</code> 를 계좌 코드에서 직접 쓰는 대신 <code>IClock</code> 을 생성자로 받는 가장 큰 이유는?', options: ['실행 속도가 빨라진다', '테스트할 때 정해진 시각을 넣어 결과를 예측 · 확인할 수 있다', 'DateTime 은 계좌 클래스에서 쓸 수 없다', '메모리를 덜 쓴다'], answer: 1, explain: '시각을 밖에서 주입하면 FakeClock 으로 결과를 고정할 수 있고, 하루 뒤 · 월말 같은 상황도 기다리지 않고 시험할 수 있습니다.' },
          { q: '<code>accounts.TryGetValue("999-9999", out Account? acc)</code> 에서 키가 없으면?', options: ['KeyNotFoundException 이 발생한다', 'false 를 돌려주고 acc 는 null', 'true 를 돌려주고 acc 는 null', '새 계좌를 만든다'], answer: 1, explain: 'TryGetValue 는 예외 없이 bool 로 알려 줍니다. 인덱서 <code>accounts["999-9999"]</code> 로 읽으면 KeyNotFoundException 입니다.' },
          { q: '이체를 “<code>to.Deposit</code> → <code>from.Withdraw</code>” 순서로 구현하면 생기는 문제는?', options: ['문제없다', '출금이 실패하면 입금만 된 상태가 되어 돈이 생긴다', '컴파일 오류가 난다', '두 계좌 모두 출금된다'], answer: 1, explain: '입금이 먼저 성공한 뒤 출금이 예외로 실패하면 되돌릴 방법이 없습니다. 실패할 수 있는 일을 먼저 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ① — 거래 내역 · 시계 · 이체', subtitle: 'Project 02 · 은행 계좌 관리 — 2교시', badge: 'P02-2',
            notes: '<p><b>[복습 3분]</b> 1교시의 캡슐화된 Account 와 BankException 계층을 다시 보여 줍니다. 오늘은 “기록 · 시간 · 여러 계좌” 세 가지를 더합니다.</p>' },
          { layout: 'bullets', title: '단계 1 — 거래 내역', lead: '잔액이 바뀌면 반드시 기록이 남아야 한다',
            bullets: ['<code>Transaction</code>: 시각 · 종류 · 금액(±) · 거래 후 잔액 · 메모', '<code>private List&lt;Transaction&gt; history</code>', '밖에는 <code>IReadOnlyList&lt;Transaction&gt;</code> 만', '잔액 변경은 <code>Change</code> 한 곳에서 → 기록 누락 불가'],
            notes: '<p><b>[4분]</b> 발문: “Deposit 에도, Withdraw 에도, 이자에도 history.Add 를 쓰면 어떤 위험이 있을까?” → 하나를 빠뜨릴 수 있다. 한 곳에 모으면 빠뜨릴 수 없다.</p>' },
          { layout: 'code', title: '단계 1. 기록 한 곳에 모으기', code: `using System;
using System.Collections.Generic;

class Account
{
    private readonly List<string> history = new List<string>();
    public decimal Balance { get; private set; }
    public IReadOnlyList<string> History => history;

    public void Deposit(decimal a) => Change(a, "입금");
    public void Withdraw(decimal a) => Change(-a, "출금");

    private void Change(decimal delta, string kind)
    {
        Balance += delta;
        history.Add($"{kind} {delta:+#,0;-#,0} → {Balance:N0}");
    }
}

class Program
{
    static void Main()
    {
        var acc = new Account();
        acc.Deposit(100000); acc.Withdraw(25000);
        foreach (string h in acc.History) Console.WriteLine(h);
    }
}`, points: ['잔액을 바꾸는 길은 <code>Change</code> 하나', '<code>+#,0;-#,0</code>: 양수에 + 붙이기', '읽기 전용 목록 공개'],
            notes: '<p><b>[4분]</b> 슬라이드는 검사를 뺀 축약판입니다(본문은 예외 검사 포함). <code>acc.History.Add("가짜")</code> 를 써 보게 해 컴파일 오류를 확인하세요.</p>' },
          { layout: 'two', title: '단계 2 — 시간 문제', left: { title: '✗ DateTime.Now 직접', bullets: ['실행할 때마다 결과가 다름', '자동 테스트 불가', '“다음 날” 을 시험하려면 하루 기다림'] }, right: { title: '✔ IClock 주입', bullets: ['진짜: <code>SystemClock</code>', '테스트: <code>FakeClock</code> + <code>Advance</code>', '계좌 코드는 <code>clock.Now</code> 만'] },
            notes: '<p><b>[4분]</b> 단계 1 예제를 두 번 실행해 시각이 바뀌는 것을 보여 줍니다. “이 출력을 정답으로 저장해 둘 수 있을까요?” → 없다. 그래서 시계를 바꿔 끼울 수 있게.</p>' },
          { layout: 'code', title: '단계 2. IClock 과 FakeClock', code: `using System;

interface IClock { DateTime Now { get; } }

class SystemClock : IClock { public DateTime Now => DateTime.Now; }

class FakeClock : IClock
{
    public DateTime Now { get; private set; }
    public FakeClock(DateTime start) { Now = start; }
    public void Advance(TimeSpan span) { Now = Now + span; }
}

class Program
{
    static void Log(IClock clock, string msg) =>
        Console.WriteLine($"[{clock.Now:MM-dd HH:mm}] {msg}");

    static void Main()
    {
        var fake = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));
        Log(fake, "입금");
        fake.Advance(TimeSpan.FromDays(1));
        Log(fake, "다음 날 출금");
    }
}`, points: ['인터페이스 = “할 수 있는 일” 의 약속', '<code>Log</code> 는 어떤 시계인지 모른다', '<code>Advance</code> 로 시간 여행', '<code>new SystemClock()</code> 을 넣으면 진짜 시각'],
            notes: '<p><b>[6분]</b> Log(new SystemClock(), "지금") 을 추가해 실행해 보이면 두 시계가 같은 메서드에 들어가는 것을 확인할 수 있습니다. 의존성 주입이라는 용어를 소개합니다.</p>' },
          { layout: 'diagram', title: '단계 3 — 이체의 순서', html: SVG_TRANSFER, caption: '검사가 필요한 일 먼저, 입금은 마지막',
            notes: '<p><b>[4분]</b> 빨간 점선: 어느 단계에서 예외가 나도 그 뒤는 실행되지 않는다. 발문: “입금을 먼저 하면?” → 은행이 돈을 만든다. 원자성(atomicity) 용어 소개.</p>' },
          { layout: 'code', title: '단계 3. Dictionary 로 계좌 찾기', code: `using System;
using System.Collections.Generic;

class Program
{
    static Dictionary<string, decimal> accounts = new Dictionary<string, decimal>
    {
        ["100-0001"] = 100000,
        ["100-0002"] = 20000
    };

    static decimal Find(string no)
    {
        if (accounts.TryGetValue(no, out decimal balance)) return balance;
        throw new KeyNotFoundException($"계좌를 찾을 수 없습니다: {no}");
    }

    static void Main()
    {
        Console.WriteLine($"{Find("100-0001"):N0}원");
        try { Find("999-9999"); }
        catch (KeyNotFoundException ex) { Console.WriteLine(ex.Message); }
        Console.WriteLine($"다음 번호: 100-{3:D4}");
    }
}`, points: ['키(계좌번호) → 값(계좌)', '<code>TryGetValue</code>: 예외 없이 찾기', '없으면 우리 예외로 바꿔 던지기', '<code>{n:D4}</code>: 0001 형식'],
            notes: '<p><b>[4분]</b> 슬라이드는 잔액만 값으로 둔 축약판입니다. 본문 Bank 는 값이 Account 객체이고, 없으면 AccountNotFoundException 을 던집니다.</p>' },
          { layout: 'table', title: '단계 3 — 이체 실패 시나리오', head: ['이체', '결과', '두 계좌'], rows: [['A → B 30,000', '성공', 'A −30,000, B +30,000'], ['B → A 100,000', '잔액 부족', '그대로'], ['A → 999-9999', '계좌 없음', '그대로'], ['A → A', '같은 계좌', '그대로'], ['A → B −5,000', '금액 오류', '그대로']],
            lead: '실패한 이체는 흔적을 남기지 않는다',
            notes: '<p><b>[5분]</b> 본문 단계 3 예제를 실행하고 표와 비교합니다. 각 계좌 내역에 실패한 이체가 없는 것을 확인하세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 중 자동 테스트(정해진 expect 비교)가 가능한 것은?', options: ['DateTime.Now 로 시각을 찍는 코드', 'new Random() 으로 뽑은 번호', 'FakeClock(2025-03-03 09:00) 으로 찍은 시각', '현재 컴퓨터 이름을 출력하는 코드'], answer: 2, explain: '정해진 시각에서 출발하는 가짜 시계는 언제 실행해도 같은 결과를 냅니다.',
            notes: '<p><b>[2분]</b> Random 도 시드(new Random(42))를 주면 결과가 고정된다는 것은 P03 게임 프로젝트에서 씁니다.</p>' },
          { layout: 'practice', title: '실습 P2-4. 이체 수수료', desc: '주인이 다르면 수수료 500원. <b>금액 + 수수료</b>를 먼저 검사해 “반쯤 성공” 을 막기', starter: `using System;

class Program
{
    static decimal a = 5000, b = 0;
    static void Transfer(decimal amount, bool otherOwner)
    {
        decimal fee = otherOwner ? 500 : 0;
        // TODO: amount + fee > a 이면 예외 (출금 전에!)
        a -= amount;
        a -= fee;
        b += amount;
    }
    static void Main()
    {
        try { Transfer(4800, true); }
        catch (InvalidOperationException ex) { Console.WriteLine(ex.Message); }
        Console.WriteLine($"a={a:N0}, b={b:N0}");
    }
}`, solution: `using System;

class Program
{
    static decimal a = 5000, b = 0;
    static void Transfer(decimal amount, bool otherOwner)
    {
        decimal fee = otherOwner ? 500 : 0;
        if (amount + fee > a)
            throw new InvalidOperationException($"잔액 부족 (필요 {amount + fee:N0}원)");
        a -= amount;
        a -= fee;
        b += amount;
    }
    static void Main()
    {
        try { Transfer(4800, true); }
        catch (InvalidOperationException ex) { Console.WriteLine(ex.Message); }
        Console.WriteLine($"a={a:N0}, b={b:N0}");
    }
}`,
            notes: '<p><b>[실습 안내]</b> 먼저 검사 없이 실행하면 a 가 음수가 되는 것을 보게 한 뒤 고치게 합니다. 본문 실습은 Bank.Transfer 에 같은 규칙을 넣습니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['거래 = <code>Transaction</code> 객체, 목록은 private + IReadOnlyList', '잔액 변경은 <code>Change</code> 한 곳 → 기록 누락 불가', '<code>DateTime.Now</code> 대신 <code>IClock</code> 주입 → 테스트 가능', '<code>Dictionary</code> + <code>TryGetValue</code> 로 계좌 찾기', '이체: 찾기 → 검사 → 출금 → 입금 (원자성)'],
            notes: '<p>다음 시간: Account 를 추상 클래스로 바꾸고 저축예금 · 마이너스통장을 상속으로 만듭니다.</p>' }
        ]
      },

      /* =========================================================== 3교시 */
      {
        id: 'p02-3',
        title: '단계별 구현 ② — 상속 · 인터페이스 · 다형성',
        minutes: 50,
        goals: [
          'Account 를 추상 클래스로 바꾸고 abstract · virtual 멤버로 “파생 클래스가 정할 부분” 을 표시할 수 있다',
          '저축예금(IInterestBearing 구현)과 마이너스통장(Available 재정의)을 상속으로 만들 수 있다',
          'List<Account> 에 여러 종류의 계좌를 담아 다형성으로 처리하고, is · switch 형식 패턴 · OfType 으로 종류별 처리를 할 수 있다'
        ],
        flow: [['복습 · 목표', 3], ['단계 4: 추상 클래스 · 저축예금', 14], ['단계 5: 마이너스통장', 10], ['단계 6: 다형성', 13], ['실습 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '단계 4. 추상 클래스 Account 와 저축예금' },
          { type: 'p', html: '저축예금과 마이너스통장은 번호 · 주인 · 잔액 · 내역 · 입금 · 출금이 <b>똑같고</b>, 이자 · 출금 가능 금액만 <b>다릅니다</b>. 같은 부분은 부모 클래스 <code>Account</code> 에 두고, 다른 부분만 자식 클래스에 씁니다(9장 상속). 그냥 “계좌” 라는 것은 실제로 존재하지 않으므로 <code>Account</code> 는 <b><code>abstract</code></b> 로 만들어 <code>new Account(…)</code> 를 막습니다.' },
          { type: 'table', head: ['키워드', 'Account 에서의 뜻', '파생 클래스는'], rows: [
            ['<code>abstract string KindName</code>', '“종류 이름은 있어야 하는데 무엇인지는 모름”', '<b>반드시</b> <code>override</code> 해야 함'],
            ['<code>virtual decimal Available</code>', '“기본은 잔액. 필요하면 바꿔도 됨”', '<b>필요하면</b> <code>override</code>'],
            ['<code>protected virtual void ValidateWithdraw</code>', '출금 검사 규칙의 기본값', '규칙을 더하거나 바꿀 때 <code>override</code>'],
            ['<code>protected void Change</code>', '잔액을 바꾸는 유일한 길 (내역 기록)', '호출만 가능 (이자 입금 등)'],
            ['<code>protected Account(…)</code>', '파생 클래스만 부를 수 있는 생성자', '<code>: base(…)</code> 로 호출']
          ] },
          { type: 'p', html: '이자가 붙는다는 “능력” 은 <b>인터페이스 <code>IInterestBearing</code></b> 으로 표현합니다. 나중에 정기적금 · 청년통장처럼 이자가 붙는 다른 계좌가 생겨도 같은 인터페이스를 구현하면 이자 지급 코드는 그대로 쓸 수 있습니다.' },
          { type: 'code', title: '단계 4. 추상 클래스 Account 와 SavingsAccount (IInterestBearing)', code: `using System;
using System.Collections.Generic;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNTS}

class Program
{
    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 31, 18, 0, 0));
        var s = new SavingsAccount("110-0001", "김민준", clock, 0.025m);
        s.Deposit(1234567, "저축");
        Console.WriteLine($"{s.KindName}, 금리 {s.InterestRate:P1}");

        clock.Advance(TimeSpan.FromHours(6));          // 월말 자정 이자 지급
        decimal interest = s.ApplyInterest();
        Console.WriteLine($"이자 {interest:N0}원 → {s}");

        IInterestBearing ib = s;                         // 인터페이스 형식 변수로도 다룰 수 있다
        clock.Advance(TimeSpan.FromDays(30));
        Console.WriteLine($"인터페이스로 호출: 이자 {ib.ApplyInterest():N0}원");

        foreach (Transaction t in s.History)
            Console.WriteLine("  " + t);
        // Account a = new Account("x", "y", clock);   // 오류 CS0144: 추상 클래스는 만들 수 없다
    }
}`, expect: `저축예금, 금리 2.5%
이자 30,864원 → [저축예금] 110-0001 김민준 잔액 1,265,431원
인터페이스로 호출: 이자 31,635원
  03-31 18:00  입금  +1,234,567  잔액  1,234,567  저축
  04-01 00:00  이자     +30,864  잔액  1,265,431  연 2.5%
  05-01 00:00  이자     +31,635  잔액  1,297,066  연 2.5%`, desc: '<code>SavingsAccount : Account, IInterestBearing</code> — 클래스 상속은 하나, 인터페이스는 여러 개 쓸 수 있습니다. <code>ApplyInterest</code> 는 잔액을 직접 바꾸지 못하고(<code>private set</code>) 부모의 <code>protected Change</code> 를 불러 이자를 넣으므로 <b>이자도 자동으로 내역에 남습니다</b>. <code>ToString()</code> 을 재정의해 두어 <code>{s}</code> 만 써도 계좌 요약이 나옵니다.' },
          { type: 'callout', kind: 'info', title: '추상 클래스 vs 인터페이스, 무엇을 쓸까?', html: '<b>추상 클래스</b>는 “무엇이다(is-a)” — 공통 <b>데이터와 코드</b>를 물려줍니다(잔액, 내역, 입출금 흐름). 하나만 상속할 수 있습니다. <b>인터페이스</b>는 “무엇을 할 수 있다(can-do)” — <b>약속(멤버 목록)</b>만 정하고, 여러 개를 구현할 수 있습니다. 저축예금은 계좌<b>이고</b>(Account 상속), 이자를 받을 수 <b>있습니다</b>(IInterestBearing 구현).' },
          { type: 'h', text: '단계 5. 마이너스통장 — 규칙 하나만 바꾸기' },
          { type: 'p', html: '마이너스통장은 잔액이 0 이어도 <b>한도만큼 더</b> 출금할 수 있습니다. 출금 흐름(<code>Withdraw</code>)은 부모에 있고, 그 흐름 안에서 “얼마까지 뺄 수 있나” 를 묻는 <code>Available</code> 이 <code>virtual</code> 이므로, 마이너스통장은 <b><code>Available</code> 한 줄만 재정의</b>하면 됩니다. 부모의 코드가 흐름을, 자식의 코드가 규칙을 정하는 구조입니다.' },
          { type: 'figure', html: SVG_POLY, caption: '같은 Withdraw 호출, 다른 결과 — virtual 속성 Available 이 실제 객체의 형식에 맞게 실행된다' },
          { type: 'code', title: '단계 5. CheckingAccount — Available 재정의로 마이너스 한도', code: `using System;
using System.Collections.Generic;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNTS}

class Program
{
    static void TryWithdraw(Account acc, decimal amount)
    {
        try
        {
            acc.Withdraw(amount, "출금");
            Console.WriteLine($"  {amount:N0}원 출금 성공 → 잔액 {acc.Balance:N0}원, 출금 가능 {acc.Available:N0}원");
        }
        catch (InsufficientFundsException ex)
        {
            Console.WriteLine($"  {amount:N0}원 출금 실패 — {ex.Message}");
        }
    }

    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));
        Account[] accounts =
        {
            new SavingsAccount("110-0001", "김민준", clock, 0.025m),
            new CheckingAccount("220-0002", "이서연", clock, 500000)
        };
        foreach (Account acc in accounts)
        {
            acc.Deposit(100000, "급여");
            Console.WriteLine($"{acc} — 출금 가능 {acc.Available:N0}원");
            TryWithdraw(acc, 400000);       // 같은 호출, 계좌 종류에 따라 다른 결과
            TryWithdraw(acc, 300000);
        }
    }
}`, expect: `[저축예금] 110-0001 김민준 잔액 100,000원 — 출금 가능 100,000원
  400,000원 출금 실패 — 잔액이 부족합니다 (출금 가능 100,000원, 요청 400,000원)
  300,000원 출금 실패 — 잔액이 부족합니다 (출금 가능 100,000원, 요청 300,000원)
[마이너스통장] 220-0002 이서연 잔액 100,000원 — 출금 가능 600,000원
  400,000원 출금 성공 → 잔액 -300,000원, 출금 가능 200,000원
  300,000원 출금 실패 — 잔액이 부족합니다 (출금 가능 200,000원, 요청 300,000원)`, desc: '<code>TryWithdraw</code> 는 매개변수가 <code>Account</code> 라서 어떤 계좌든 받습니다. 그 안의 <code>acc.Withdraw</code> 는 부모 코드 하나지만, 내부에서 읽는 <code>Available</code> 은 <b>실제 객체</b>(저축 / 마이너스)의 버전이 실행됩니다. 이것이 <b>다형성(polymorphism)</b>입니다. 부모의 <code>Withdraw</code> 코드는 한 글자도 바꾸지 않았습니다.' },
          { type: 'callout', kind: 'warn', title: 'override 대신 new 를 쓰면?', html: '파생 클래스에서 <code>public new decimal Available =&gt; …</code> 처럼 <code>new</code> 로 숨기면(또는 부모 멤버에 <code>virtual</code> 이 없으면) <b>다형성이 동작하지 않습니다</b>. <code>Account</code> 형식 변수로 부르면 부모 버전이 실행되어 마이너스통장도 잔액까지만 출금됩니다. 파생 클래스가 바꿀 수 있어야 하는 멤버는 부모에서 <code>virtual</code>, 자식에서 <code>override</code> 입니다.' },
          { type: 'h', text: '단계 6. 다형성 — 여러 종류의 계좌를 한꺼번에' },
          { type: 'p', html: '은행은 여러 종류의 계좌를 <code>List&lt;Account&gt;</code> 하나에 담아 처리합니다. 공통 멤버(<code>ToString</code>, <code>Available</code>)는 그냥 부르면 되고, <b>종류에 따라 다른 일</b>이 필요할 때는 12장의 형식 패턴을 씁니다.' },
          { type: 'list', items: [
            '<code>if (a is IInterestBearing ib)</code> — “이자를 받을 수 있는 계좌라면 ib 라는 이름으로 써라”',
            '<code>a switch { SavingsAccount s =&gt; …, CheckingAccount c =&gt; …, _ =&gt; … }</code> — 형식마다 다른 값',
            '<code>accounts.OfType&lt;IInterestBearing&gt;()</code> — 그 형식인 것만 골라내는 LINQ'
          ] },
          { type: 'code', title: '단계 6. List<Account> 와 형식 패턴 · OfType', code: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNTS}

class Program
{
    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 31, 18, 0, 0));
        List<Account> accounts = new List<Account>
        {
            new SavingsAccount("110-0001", "김민준", clock, 0.025m),
            new CheckingAccount("220-0002", "이서연", clock, 500000),
            new SavingsAccount("110-0003", "박지호", clock, 0.03m)
        };
        accounts[0].Deposit(1000000);
        accounts[1].Withdraw(200000);            // 마이너스통장이라 가능
        accounts[2].Deposit(500000);

        foreach (Account a in accounts)          // 종류가 달라도 Account 로 한꺼번에
        {
            string extra = a switch
            {
                SavingsAccount s => $"금리 {s.InterestRate:P1}",
                CheckingAccount c => $"한도 {c.OverdraftLimit:N0}원",
                _ => ""
            };
            Console.WriteLine($"{a}  ({extra}, 출금 가능 {a.Available:N0}원)");
        }

        Console.WriteLine("--- 이자 지급 ---");
        foreach (Account a in accounts)
        {
            if (a is IInterestBearing ib)
                Console.WriteLine($"{a.Owner}: 이자 {ib.ApplyInterest():N0}원");
            else
                Console.WriteLine($"{a.Owner}: 이자 대상 아님 ({a.KindName})");
        }

        int count = accounts.OfType<IInterestBearing>().Count();
        decimal avgRate = accounts.OfType<IInterestBearing>().Average(x => x.InterestRate);
        Console.WriteLine($"이자 계좌 {count}개, 평균 금리 {avgRate:P2}");
    }
}`, expect: `[저축예금] 110-0001 김민준 잔액 1,000,000원  (금리 2.5%, 출금 가능 1,000,000원)
[마이너스통장] 220-0002 이서연 잔액 -200,000원  (한도 500,000원, 출금 가능 300,000원)
[저축예금] 110-0003 박지호 잔액 500,000원  (금리 3.0%, 출금 가능 500,000원)
--- 이자 지급 ---
김민준: 이자 25,000원
이서연: 이자 대상 아님 (마이너스통장)
박지호: 이자 15,000원
이자 계좌 2개, 평균 금리 2.75%`, desc: '<code>foreach (Account a in accounts)</code> 안에서는 <code>a</code> 가 어떤 종류인지 몰라도 <code>a.ToString()</code> · <code>a.Available</code> 이 각자의 버전으로 실행됩니다. 이자처럼 <b>일부 종류만 할 수 있는 일</b>은 <code>is IInterestBearing ib</code> 로 확인한 뒤 씁니다. 새 계좌 종류가 생겨도 이 반복문은 고칠 필요가 없습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 개방-폐쇄 원칙 (OCP)', html: '“확장에는 열려 있고, 수정에는 닫혀 있어야 한다.” 새 계좌 종류(예: 청년통장)를 추가할 때 <code>Account</code> · <code>Bank</code> · 이자 지급 반복문을 <b>고치지 않고</b> 새 클래스 하나만 <b>추가</b>하면 되는 설계가 좋은 설계라는 원칙입니다. 반대로 <code>if (종류 == "저축") … else if (종류 == "마이너스") …</code> 처럼 문자열로 종류를 나누면 종류가 늘 때마다 여러 곳을 고쳐야 합니다.' }
        ],
        practice: [
          {
            title: '실습 P2-5. 청년통장 — 출금 규칙 더하기',
            level: 2,
            desc: '<p><code>Account</code> 를 상속한 <code>YouthAccount</code>(종류 이름 <code>청년통장</code>)를 만드세요. 1회 출금이 30만 원을 넘으면 <code>BankException("청년통장은 1회 300,000원까지 출금할 수 있습니다")</code> 을 던지고, 넘지 않으면 원래 규칙(잔액 검사)을 그대로 적용합니다.</p>',
            hint: '<code>protected override void ValidateWithdraw(decimal amount)</code> 에서 한도를 검사한 뒤 <code>base.ValidateWithdraw(amount);</code> 로 부모 규칙을 이어서 실행합니다.',
            starter: `using System;
using System.Collections.Generic;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNTS}

// TODO: YouthAccount 만들기 (KindName, ValidateWithdraw 재정의)

class Program
{
    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));
        Account acc = new SavingsAccount("330-0001", "정하준", clock, 0.02m);   // TODO: YouthAccount 로 바꾸기
        acc.Deposit(500000);
        foreach (decimal amount in new decimal[] { 350000, 250000, 300000 })
        {
            try
            {
                acc.Withdraw(amount);
                Console.WriteLine($"{amount:N0}원 출금 → {acc}");
            }
            catch (BankException ex)
            {
                Console.WriteLine($"{amount:N0}원 실패: {ex.Message}");
            }
        }
    }
}
`,
            solution: `using System;
using System.Collections.Generic;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNTS}

class YouthAccount : Account
{
    public const decimal MaxPerWithdraw = 300000m;

    public YouthAccount(string number, string owner, IClock clock) : base(number, owner, clock) { }

    public override string KindName => "청년통장";

    protected override void ValidateWithdraw(decimal amount)
    {
        if (amount > MaxPerWithdraw)
            throw new BankException($"청년통장은 1회 {MaxPerWithdraw:N0}원까지 출금할 수 있습니다");
        base.ValidateWithdraw(amount);          // 원래 규칙(잔액 검사)도 그대로
    }
}

class Program
{
    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));
        Account acc = new YouthAccount("330-0001", "정하준", clock);
        acc.Deposit(500000);
        foreach (decimal amount in new decimal[] { 350000, 250000, 300000 })
        {
            try
            {
                acc.Withdraw(amount);
                Console.WriteLine($"{amount:N0}원 출금 → {acc}");
            }
            catch (BankException ex)
            {
                Console.WriteLine($"{amount:N0}원 실패: {ex.Message}");
            }
        }
    }
}`,
            expect: `350,000원 실패: 청년통장은 1회 300,000원까지 출금할 수 있습니다
250,000원 출금 → [청년통장] 330-0001 정하준 잔액 250,000원
300,000원 실패: 잔액이 부족합니다 (출금 가능 250,000원, 요청 300,000원)`
          },
          {
            title: '실습 P2-6. 월 수수료 인터페이스',
            level: 3,
            desc: '<p>인터페이스 <code>IMonthlyCharge</code>(<code>decimal ChargeMonthly();</code>)를 만들고, 마이너스통장을 상속한 <code>PremiumChecking</code>(종류 이름 <code>프리미엄마이너스</code>)이 구현하게 하세요. 규칙: 잔액이 음수이면 <b>대출 이자</b> = 음수 잔액 × 1% (원 미만 버림)를 출금(메모 <code>대출 이자</code>)합니다. 한도와 관계없이 반드시 빠져나가야 하므로 <code>Withdraw</code> 가 아니라 <code>Change</code> 를 씁니다.</p><p><code>OfType&lt;IMonthlyCharge&gt;()</code> 로 대상 계좌만 골라 처리하고 합계를 출력합니다.</p>',
            hint: '<code>class PremiumChecking : CheckingAccount, IMonthlyCharge</code>. 이자: <code>Math.Floor(-Balance * 0.01m)</code>, 출금: <code>Change(-fee, "출금", "대출 이자")</code>.',
            starter: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNTS}

// TODO: IMonthlyCharge 인터페이스
// TODO: PremiumChecking : CheckingAccount, IMonthlyCharge

class Program
{
    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 31, 23, 0, 0));
        var accounts = new List<Account>
        {
            new SavingsAccount("110-0001", "김민준", clock, 0.025m),
            new CheckingAccount("220-0002", "이서연", clock, 1000000)   // TODO: PremiumChecking 으로
        };
        accounts[0].Deposit(300000);
        accounts[1].Withdraw(456789);
        // TODO: OfType<IMonthlyCharge>() 로 월 수수료 처리
        foreach (Account a in accounts) Console.WriteLine(a);
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNTS}

interface IMonthlyCharge
{
    decimal ChargeMonthly();
}

class PremiumChecking : CheckingAccount, IMonthlyCharge
{
    public PremiumChecking(string number, string owner, IClock clock, decimal limit)
        : base(number, owner, clock, limit) { }

    public override string KindName => "프리미엄마이너스";

    public decimal ChargeMonthly()
    {
        if (Balance >= 0) return 0;
        decimal fee = Math.Floor(-Balance * 0.01m);
        if (fee > 0) Change(-fee, "출금", "대출 이자");
        return fee;
    }
}

class Program
{
    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 31, 23, 0, 0));
        var accounts = new List<Account>
        {
            new SavingsAccount("110-0001", "김민준", clock, 0.025m),
            new PremiumChecking("220-0002", "이서연", clock, 1000000)
        };
        accounts[0].Deposit(300000);
        accounts[1].Withdraw(456789);

        decimal total = 0;
        foreach (IMonthlyCharge m in accounts.OfType<IMonthlyCharge>())
            total += m.ChargeMonthly();
        Console.WriteLine($"월 수수료 합계: {total:N0}원");
        foreach (Account a in accounts) Console.WriteLine(a);
        foreach (Transaction t in accounts[1].History) Console.WriteLine("  " + t);
    }
}`,
            expect: `월 수수료 합계: 4,567원
[저축예금] 110-0001 김민준 잔액 300,000원
[프리미엄마이너스] 220-0002 이서연 잔액 -461,356원
  03-31 23:00  출금    -456,789  잔액   -456,789
  03-31 23:00  출금      -4,567  잔액   -461,356  대출 이자`
          }
        ],
        quiz: [
          { q: '<code>abstract class Account</code> 에 대한 설명으로 옳은 것은?', options: ['<code>new Account(…)</code> 로 객체를 만들 수 있다', '추상 멤버가 없어도 abstract 로 만들 수 없다', '직접 객체를 만들 수 없고, 파생 클래스를 통해서만 만든다', '인터페이스와 같아서 필드를 가질 수 없다'], answer: 2, explain: '추상 클래스는 객체를 직접 만들 수 없습니다(CS0144). 인터페이스와 달리 필드 · 생성자 · 완성된 메서드를 가질 수 있습니다.' },
          { q: '부모의 <code>abstract</code> 멤버와 <code>virtual</code> 멤버의 차이는?', options: ['차이가 없다', 'abstract 는 파생 클래스가 반드시 override, virtual 은 선택', 'virtual 은 반드시 override, abstract 는 선택', 'abstract 는 static 이다'], answer: 1, explain: 'abstract 는 본문이 없어서 반드시 채워야 하고, virtual 은 기본 구현이 있어 필요할 때만 재정의합니다.' },
          { q: '다음 코드에서 출력되는 값은? (<code>CheckingAccount</code> 는 <code>Available =&gt; Balance + OverdraftLimit</code> 을 override, 잔액 100,000, 한도 500,000)<pre><code>Account a = new CheckingAccount(…);\nConsole.WriteLine(a.Available);</code></pre>', options: ['100000', '500000', '600000', '컴파일 오류'], answer: 2, explain: '변수 형식은 Account 여도 virtual 멤버는 실제 객체(CheckingAccount)의 버전이 실행됩니다. 다형성입니다.' },
          { q: '<code>accounts.OfType&lt;IInterestBearing&gt;()</code> 가 돌려주는 것은?', options: ['모든 계좌', 'IInterestBearing 을 구현한 계좌만 (그 형식으로)', 'IInterestBearing 을 구현하지 않은 계좌만', '계좌 수'], answer: 1, explain: 'OfType 은 지정한 형식으로 바꿀 수 있는 요소만 골라 그 형식의 시퀀스로 돌려줍니다.' },
          { q: '<code>protected override void ValidateWithdraw(decimal amount)</code> 안에서 <code>base.ValidateWithdraw(amount);</code> 를 부르는 이유는?', options: ['부모의 원래 검사(잔액 검사)도 함께 실행하려고', '무한 재귀를 만들려고', '부모 메서드를 삭제하려고', '컴파일러가 요구해서'], answer: 0, explain: 'base.멤버 는 부모의 구현을 호출합니다. 규칙을 “바꾸는” 것이 아니라 “더하는” 경우에 씁니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ② — 상속 · 인터페이스 · 다형성', subtitle: 'Project 02 · 은행 계좌 관리 — 3교시', badge: 'P02-3',
            notes: '<p><b>[복습 3분]</b> 2교시 Account(내역 · 시계)와 Bank 를 보여 주고, “이제 계좌 종류를 늘려 봅시다. 저축예금은 이자가, 마이너스통장은 한도가 있습니다.”</p>' },
          { layout: 'table', title: '단계 4 — 부모가 정하고, 자식이 채운다', head: ['멤버', '의미'], rows: [['<code>abstract KindName</code>', '반드시 채워라'], ['<code>virtual Available</code>', '기본은 잔액, 바꿔도 됨'], ['<code>protected virtual ValidateWithdraw</code>', '출금 검사 규칙'], ['<code>protected Change</code>', '잔액 변경 + 내역 (호출만)'], ['<code>protected</code> 생성자', '<code>: base(…)</code> 로 호출']],
            lead: 'abstract class Account',
            notes: '<p><b>[5분]</b> 9장 abstract/virtual/override 를 다시 짚습니다. protected = “나와 자식만”. private set 인 Balance 를 자식이 바꾸려면 protected Change 를 거쳐야 한다는 점이 캡슐화 유지의 핵심입니다.</p>' },
          { layout: 'code', title: '단계 4. SavingsAccount : Account, IInterestBearing', code: `using System;
interface IInterestBearing { decimal ApplyInterest(); }

abstract class Account
{
    public decimal Balance { get; private set; }
    public abstract string KindName { get; }
    protected void Change(decimal delta) => Balance += delta;
    public void Deposit(decimal a) => Change(a);
}
class SavingsAccount : Account, IInterestBearing
{
    public decimal Rate { get; } = 0.025m;
    public override string KindName => "저축예금";
    public decimal ApplyInterest()
    {
        decimal i = Math.Floor(Balance * Rate);   // 원 미만 버림
        Change(i); return i;
    }
}

class Program
{
    static void Main()
    {
        var s = new SavingsAccount();         // 연 2.5%
        s.Deposit(1234567);
        Console.WriteLine($"{s.KindName} 이자 {s.ApplyInterest():N0} → {s.Balance:N0}");
    }
}`, points: ['클래스 상속 1개 + 인터페이스 여러 개', '<code>override</code> 로 추상 멤버 채우기', '잔액은 <code>Change</code> 로만', '<code>Math.Floor</code> 원 미만 버림'],
            notes: '<p><b>[6분]</b> 축약판입니다(본문은 내역 · 시계 포함). <code>override string KindName</code> 줄을 지워 CS0534(추상 멤버를 구현하지 않음) 오류를 보여 주세요.</p>' },
          { layout: 'two', title: '추상 클래스 vs 인터페이스', left: { title: 'abstract class Account', bullets: ['“~이다” (is-a)', '데이터 · 코드 물려줌', '상속은 하나만', '생성자 · 필드 가능'] }, right: { title: 'interface IInterestBearing', bullets: ['“~할 수 있다” (can-do)', '약속(멤버 목록)만', '여러 개 구현 가능', '서로 다른 계층에도 붙일 수 있다'] },
            notes: '<p><b>[3분]</b> 발문: “IClock 은 왜 인터페이스일까?” → 시계들 사이에 물려줄 공통 코드가 없고, 약속(Now)만 필요하니까.</p>' },
          { layout: 'diagram', title: '단계 5 — 같은 호출, 다른 결과', html: SVG_POLY, caption: 'virtual Available 이 실제 객체에 맞게 실행된다',
            notes: '<p><b>[4분]</b> Withdraw 코드는 하나뿐인데 결과가 다른 이유를 화살표로 설명합니다. “부모가 흐름을, 자식이 규칙을” — 템플릿 메서드 패턴이라는 이름도 소개할 수 있습니다.</p>' },
          { layout: 'code', title: '단계 5. Available 한 줄로 마이너스 한도', code: `using System;
abstract class Account
{
    public decimal Balance { get; protected set; }
    public virtual decimal Available => Balance;
    public void Withdraw(decimal amount)
    {
        if (amount > Available) throw new InvalidOperationException($"출금 가능 {Available:N0}원");
        Balance -= amount;
    }
}
class Savings : Account { public Savings(decimal b) { Balance = b; } }
class Checking : Account
{
    public Checking(decimal b) { Balance = b; }
    public override decimal Available => Balance + 500000;
}

class Program
{
    static void Main()
    {
        Account[] list = { new Savings(100000), new Checking(100000) };
        foreach (Account a in list)
        {
            try { a.Withdraw(400000); Console.WriteLine($"{a.GetType().Name}: 성공 {a.Balance:N0}"); }
            catch (InvalidOperationException ex) { Console.WriteLine($"{a.GetType().Name}: 실패 ({ex.Message})"); }
        }
    }
}`, points: ['부모 <code>virtual</code> + 자식 <code>override</code>', '<code>Withdraw</code> 는 부모에 하나만', '변수 형식이 Account 여도 실제 객체의 버전'],
            notes: '<p><b>[5분]</b> Checking 의 <code>override</code> 를 <code>new</code> 로 바꿔 실행해 보세요. 둘 다 실패합니다 → 다형성이 깨졌다. 경고 CS0114 도 함께 확인.</p>' },
          { layout: 'bullets', title: '단계 6 — 종류별로 다르게 처리하기', lead: '공통은 그냥 부르고, 일부만 가능한 일은 형식 확인',
            bullets: ['<code>foreach (Account a in accounts)</code> — 모두 같은 방식으로', '<code>if (a is IInterestBearing ib) ib.ApplyInterest();</code>', '<code>a switch { SavingsAccount s =&gt; …, CheckingAccount c =&gt; … }</code>', '<code>accounts.OfType&lt;IInterestBearing&gt;()</code>', '새 계좌 종류가 생겨도 반복문은 그대로 (OCP)'],
            notes: '<p><b>[5분]</b> 본문 단계 6 예제를 실행합니다. is 패턴은 “확인 + 형 변환 + 변수 선언” 을 한 번에 한다는 것을 강조하세요.</p>' },
          { layout: 'code', title: '단계 6. is · switch · OfType', code: `using System;
using System.Collections.Generic;
using System.Linq;

interface IInterestBearing { decimal Rate { get; } }
abstract class Account { public abstract string Kind { get; } }
class Savings : Account, IInterestBearing
{
    public decimal Rate => 0.025m;
    public override string Kind => "저축예금";
}
class Checking : Account
{
    public decimal Limit => 500000;
    public override string Kind => "마이너스통장";
}

class Program
{
    static void Main()
    {
        var list = new List<Account> { new Savings(), new Checking(), new Savings() };
        foreach (Account a in list)
        {
            string extra = a switch { Savings s => $"금리 {s.Rate:P1}", Checking c => $"한도 {c.Limit:N0}", _ => "" };
            Console.WriteLine($"{a.Kind} ({extra}) 이자 계좌? {a is IInterestBearing}");
        }
        Console.WriteLine($"이자 계좌 {list.OfType<IInterestBearing>().Count()}개");
    }
}`, points: ['형식 패턴 switch 식', '<code>is</code> 로 인터페이스 구현 여부', '<code>OfType&lt;T&gt;()</code> 로 골라내기'],
            notes: '<p><b>[4분]</b> 발문: “청년통장 클래스를 추가하면 이 코드에서 무엇을 고쳐야 하나?” → switch 식에 한 줄 추가(선택), 나머지는 그대로.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>Account a = new CheckingAccount(…);</code> 일 때 <code>a.Available</code> 은 누구의 코드가 실행될까? (<code>Available</code> 은 virtual, Checking 에서 override)', options: ['Account 의 코드 (변수 형식)', 'CheckingAccount 의 코드 (실제 객체)', '둘 다 실행', '컴파일 오류'], answer: 1, explain: 'virtual/override 는 실행 시점의 실제 객체 형식으로 결정됩니다(동적 바인딩).',
            notes: '<p><b>[2분]</b> new 로 숨긴 경우는 변수 형식(Account)의 코드가 실행된다는 것을 대비해 설명합니다.</p>' },
          { layout: 'practice', title: '실습 P2-5. 청년통장', desc: '<code>YouthAccount : Account</code> — 1회 30만 원 초과 출금 금지, 나머지는 원래 규칙(<code>base.ValidateWithdraw</code>)', starter: `using System;

abstract class Account
{
    public decimal Balance { get; protected set; }
    protected virtual void Validate(decimal amount)
    {
        if (amount > Balance) throw new InvalidOperationException("잔액 부족");
    }
    public void Withdraw(decimal amount) { Validate(amount); Balance -= amount; }
}

// TODO: class YouthAccount : Account — Validate 재정의 + base.Validate

class Program
{
    static void Main()
    {
        Console.WriteLine("YouthAccount 를 만들어 350,000 / 250,000 / 300,000 출금 시험");
    }
}`, solution: `using System;

abstract class Account
{
    public decimal Balance { get; protected set; }
    protected virtual void Validate(decimal amount)
    {
        if (amount > Balance) throw new InvalidOperationException("잔액 부족");
    }
    public void Withdraw(decimal amount) { Validate(amount); Balance -= amount; }
}

class YouthAccount : Account
{
    public YouthAccount(decimal b) { Balance = b; }
    protected override void Validate(decimal amount)
    {
        if (amount > 300000) throw new InvalidOperationException("1회 300,000원까지");
        base.Validate(amount);
    }
}

class Program
{
    static void Main()
    {
        var y = new YouthAccount(500000);
        foreach (decimal a in new decimal[] { 350000, 250000, 300000 })
        {
            try { y.Withdraw(a); Console.WriteLine($"{a:N0} 성공 → {y.Balance:N0}"); }
            catch (InvalidOperationException ex) { Console.WriteLine($"{a:N0} 실패: {ex.Message}"); }
        }
    }
}`,
            notes: '<p><b>[실습 안내]</b> <code>base.Validate</code> 를 빼먹으면 300,000 출금이 잔액보다 커도 통과해 버립니다 — 일부러 빼고 실행해 보게 하세요. 빠른 학생은 실습 P2-6(월 수수료 인터페이스).</p>' },
          { layout: 'summary', title: '정리', bullets: ['공통 → 추상 클래스 <code>Account</code>, 다른 점 → 파생 클래스', '<code>abstract</code> 반드시 · <code>virtual</code> 선택 · <code>override</code> 로 채우기', '능력은 인터페이스 (<code>IInterestBearing</code>)', '다형성: 같은 호출, 실제 객체에 맞는 동작', '<code>is</code> · switch 형식 패턴 · <code>OfType</code>'],
            notes: '<p>다음 시간: 메뉴 프로그램으로 완성하고 LINQ 보고서를 만듭니다. 오늘 만든 클래스들은 그대로 파일로 나누어 씁니다.</p>' }
        ]
      },

      /* =========================================================== 4교시 */
      {
        id: 'p02-4',
        title: '완성과 확장',
        minutes: 50,
        goals: [
          'SelectMany · GroupBy · Sum · MaxBy 로 여러 계좌와 거래를 모아 보고서를 만들 수 있다',
          '예외를 메뉴 반복의 한 곳에서 처리하는 완성 프로그램을 여러 파일로 나누어 구성할 수 있다',
          '규칙(불변 조건)마다 테스트 시나리오를 만들어 확인하고, 새 기능을 추가하는 확장 과제를 구현할 수 있다'
        ],
        flow: [['복습 · 목표', 3], ['단계 7: LINQ 보고서', 12], ['완성 프로그램', 15], ['테스트 · 확장 과제', 15], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '단계 7. LINQ 로 은행 보고서 만들기' },
          { type: 'p', html: '은행장은 “예금이 모두 얼마인지”, “계좌 종류별로 얼마씩인지”, “오늘 입금 · 출금이 몇 건인지” 를 알고 싶어 합니다. 계좌 목록과 각 계좌의 거래 내역을 LINQ 로 모으면 몇 줄로 보고서를 만들 수 있습니다. 여기서 새로 쓰는 것은 <b><code>SelectMany</code></b> — 계좌마다 있는 거래 목록들을 <b>한 줄로 펼쳐</b> 하나의 거래 목록으로 만듭니다.' },
          { type: 'table', head: ['질문', 'LINQ'], rows: [
            ['고객은 몇 명?', '<code>all.Select(a =&gt; a.Owner).Distinct().Count()</code>'],
            ['예금 합계 / 마이너스 합계', '<code>all.Where(a =&gt; a.Balance &gt; 0).Sum(a =&gt; a.Balance)</code>'],
            ['종류별 계좌 수 · 잔액', '<code>all.GroupBy(a =&gt; a.KindName)</code> → <code>g.Key</code>, <code>g.Count()</code>, <code>g.Sum(…)</code>'],
            ['모든 거래', '<code>all.SelectMany(a =&gt; a.History)</code>'],
            ['거래 유형별 건수 · 합계', '<code>txs.GroupBy(t =&gt; t.Kind)</code>'],
            ['고객별 총잔액', '<code>all.GroupBy(a =&gt; a.Owner).Select(g =&gt; (g.Key, g.Sum(a =&gt; a.Balance)))</code>'],
            ['잔액 1위 계좌', '<code>all.MaxBy(a =&gt; a.Balance)</code>']
          ] },
          { type: 'code', title: '단계 7. 은행 보고서 (SelectMany · GroupBy)', code: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNTS}

${CS_BANK}

class Program
{
    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));
        var bank = new Bank(clock);
        var kimS = bank.OpenSavings("김민준", 0.025m, 1000000);
        var leeC = bank.OpenChecking("이서연", 500000, 100000);
        var parkS = bank.OpenSavings("박지호", 0.03m, 500000);
        var kimC = bank.OpenChecking("김민준", 300000, 0);
        bank.Transfer(kimS.Number, leeC.Number, 200000);
        leeC.Withdraw(450000, "등록금");
        kimC.Withdraw(100000, "생활비");
        foreach (var ib in bank.Accounts.OfType<IInterestBearing>()) ib.ApplyInterest();

        var all = bank.Accounts.ToList();
        Console.WriteLine($"계좌 {all.Count}개 · 고객 {all.Select(a => a.Owner).Distinct().Count()}명");
        Console.WriteLine($"예금 합계 {all.Where(a => a.Balance > 0).Sum(a => a.Balance):N0}원, " +
                          $"마이너스 합계 {all.Where(a => a.Balance < 0).Sum(a => a.Balance):N0}원");

        Console.WriteLine("[종류별]");
        foreach (var g in all.GroupBy(a => a.KindName))
            Console.WriteLine($"  {g.Key}: {g.Count()}개, 잔액 합계 {g.Sum(a => a.Balance):N0}원");

        Console.WriteLine("[거래 유형별]");
        var txs = all.SelectMany(a => a.History);          // 모든 계좌의 거래를 한 줄로 펼친다
        foreach (var g in txs.GroupBy(t => t.Kind).OrderBy(g => g.Key))
            Console.WriteLine($"  {g.Key} {g.Count()}건, 합계 {g.Sum(t => t.Amount):+#,0;-#,0}원");

        Console.WriteLine("[고객별 총잔액]");
        var byOwner = all.GroupBy(a => a.Owner)
                         .Select(g => new { Owner = g.Key, Count = g.Count(), Total = g.Sum(a => a.Balance) })
                         .OrderByDescending(x => x.Total);
        foreach (var x in byOwner)
            Console.WriteLine($"  {x.Owner}: 계좌 {x.Count}개, {x.Total:N0}원");

        Account top = all.MaxBy(a => a.Balance)!;
        Console.WriteLine($"잔액 1위: {top}");
    }
}`, expect: `계좌 4개 · 고객 3명
예금 합계 1,335,000원, 마이너스 합계 -250,000원
[종류별]
  저축예금: 2개, 잔액 합계 1,335,000원
  마이너스통장: 2개, 잔액 합계 -250,000원
[거래 유형별]
  이자 2건, 합계 +35,000원
  입금 4건, 합계 +1,800,000원
  출금 3건, 합계 -750,000원
[고객별 총잔액]
  김민준: 계좌 2개, 720,000원
  박지호: 계좌 1개, 515,000원
  이서연: 계좌 1개, -150,000원
잔액 1위: [저축예금] 110-0001 김민준 잔액 820,000원`, desc: '<code>foreach (var ib in bank.Accounts.OfType&lt;IInterestBearing&gt;()) ib.ApplyInterest();</code> 한 줄로 이자 계좌에만 이자를 넣었습니다. <code>new { Owner = …, Count = …, Total = … }</code> 는 이름 없는 <b>익명 형식</b>으로, 보고서처럼 잠깐 쓰는 묶음에 편리합니다. 김민준은 저축예금 820,000 + 마이너스통장 −100,000 = 720,000원입니다.' },
          { type: 'h', text: '완성 — 메뉴 프로그램과 파일 구성' },
          { type: 'p', html: '이제 클래스들을 역할별 파일로 나누고, <code>Program</code> 에 메뉴를 붙입니다. 핵심 설계는 <b>예외 처리를 메뉴 반복의 한 곳</b>에 모은 것입니다. 입금 · 출금 · 이체 메서드는 규칙 위반을 걱정하지 않고 “정상 흐름” 만 씁니다. 어디서든 <code>BankException</code> 이 나면 <code>Main</code> 의 <code>catch</code> 가 받아 <code>[오류] 메시지</code> 를 보여 주고 메뉴로 돌아갑니다.' },
          { type: 'table', head: ['파일', '내용'], rows: [
            ['<code>BankExceptions.cs</code>', '<code>BankException</code> 과 세 자식 예외'],
            ['<code>Clock.cs</code>', '<code>IClock</code> · <code>SystemClock</code> · <code>FakeClock</code>'],
            ['<code>Transaction.cs</code>', '거래 한 건'],
            ['<code>Accounts.cs</code>', '<code>IInterestBearing</code> · <code>Account</code>(추상) · <code>SavingsAccount</code> · <code>CheckingAccount</code>'],
            ['<code>Bank.cs</code>', '<code>Dictionary</code> 로 계좌 관리 · 개설 · 찾기 · 이체'],
            ['<code>Program.cs</code>', '메뉴 · 입력 · 출력 · 보고서 (Console 은 여기에서만)']
          ] },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 파일 · 네임스페이스 정리', html: '솔루션 탐색기에서 프로젝트 오른쪽 클릭 → <b>추가 → 새 폴더</b>로 <code>Models</code> 폴더를 만들어 계좌 · 거래 파일을 넣으면, 새 클래스에는 <code>namespace BankApp.Models;</code> 가 붙습니다. 이때 <code>Program.cs</code> 맨 위에 <code>using BankApp.Models;</code> 를 추가해야 합니다. 클래스 이름 위에서 <b>Ctrl+.</b> → “<b>파일 이름으로 형식 이동</b>” 을 고르면 한 파일에 몰려 있던 클래스를 각자의 파일로 자동으로 옮겨 줍니다.' },
          { type: 'p', html: '시계는 <code>FakeClock</code> 을 쓰고 메뉴를 하나 처리할 때마다 10분씩 흐르게 했습니다. 그래서 아래 실행 결과는 언제 실행해도 같습니다. 실제 서비스로 쓸 때는 <code>new FakeClock(…)</code> 한 곳만 <code>new SystemClock()</code> 으로 바꾸면 됩니다(<code>clock.Advance</code> 줄은 삭제).' },
          { type: 'code', title: '완성 프로그램. 은행 계좌 관리 (파일 분리 버전)', stdin: FINAL_STDIN, code: FINAL_CODE, expect: `
=== C# 은행 (2025-03-03 09:00) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 개설된 계좌가 없습니다.

=== C# 은행 (2025-03-03 09:10) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 종류 (1.저축예금 2.마이너스통장): 이름: 첫 입금액 (없으면 0): 개설 완료: [저축예금] 110-0001 김민준 잔액 1,000,000원

=== C# 은행 (2025-03-03 09:20) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 종류 (1.저축예금 2.마이너스통장): 이름: 첫 입금액 (없으면 0): 개설 완료: [마이너스통장] 220-0002 이서연 잔액 100,000원

=== C# 은행 (2025-03-03 09:30) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 종류 (1.저축예금 2.마이너스통장): 이름: 첫 입금액 (없으면 0): 개설 완료: [저축예금] 110-0003 박지호 잔액 500,000원

=== C# 은행 (2025-03-03 09:40) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 종류 (1.저축예금 2.마이너스통장): 종류는 1 또는 2 입니다.

=== C# 은행 (2025-03-03 09:50) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 계좌번호: 입금액: 입금 완료 → 잔액 1,050,000원

=== C# 은행 (2025-03-03 10:00) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 계좌번호: 입금액: [오류] 금액은 0보다 커야 합니다 (입력: -3,000원)

=== C# 은행 (2025-03-03 10:10) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 계좌번호: 출금액: 출금 완료 → 잔액 -350,000원 (출금 가능 650,000원)

=== C# 은행 (2025-03-03 10:20) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 계좌번호: 출금액: [오류] 잔액이 부족합니다 (출금 가능 500,000원, 요청 600,000원)

=== C# 은행 (2025-03-03 10:30) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 계좌번호: [오류] 계좌를 찾을 수 없습니다: 999-9999

=== C# 은행 (2025-03-03 10:40) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 보내는 계좌: 받는 계좌: 금액: 이체 완료: 110-0001 → 220-0002 200,000원

=== C# 은행 (2025-03-03 10:50) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 보내는 계좌: 받는 계좌: 금액: [오류] 같은 계좌로는 이체할 수 없습니다

=== C# 은행 (2025-03-03 11:00) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 보내는 계좌: 받는 계좌: 금액:   → 숫자로 입력하세요.
금액: [오류] 잔액이 부족합니다 (출금 가능 850,000원, 요청 5,000,000원)

=== C# 은행 (2025-03-03 11:10) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택:   110-0001 김민준: 이자 21,250원
  110-0003 박지호: 이자 12,500원
이자 지급 합계: 33,750원

=== C# 은행 (2025-03-03 11:20) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 계좌번호: [마이너스통장] 220-0002 이서연 잔액 -150,000원
  03-03 09:20  입금    +100,000  잔액    100,000  개설 입금
  03-03 10:10  출금    -450,000  잔액   -350,000  창구 출금
  03-03 10:40  입금    +200,000  잔액   -150,000  김민준님이 이체

=== C# 은행 (2025-03-03 11:30) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: [저축예금] 110-0001 김민준 잔액 871,250원  (금리 2.5%, 출금 가능 871,250원)
[마이너스통장] 220-0002 이서연 잔액 -150,000원  (한도 1,000,000원, 출금 가능 850,000원)
[저축예금] 110-0003 박지호 잔액 512,500원  (금리 2.5%, 출금 가능 512,500원)

=== C# 은행 (2025-03-03 11:40) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 계좌 3개 · 고객 3명
예금 합계 1,383,750원, 마이너스 합계 -150,000원
  저축예금: 2개, 잔액 합계 1,383,750원
  마이너스통장: 1개, 잔액 합계 -150,000원
  이자 2건, 합계 +33,750원
  입금 5건, 합계 +1,850,000원
  출금 2건, 합계 -650,000원
잔액 1위: 김민준 (110-0001) 871,250원

=== C# 은행 (2025-03-03 11:50) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 잘못된 선택입니다.

=== C# 은행 (2025-03-03 12:00) ===
1.개설 2.입금 3.출금 4.이체 5.내역 6.계좌목록 7.이자지급 8.보고서 0.종료
선택: 이용해 주셔서 감사합니다.`, desc: '테스트 시나리오: 빈 목록 → 계좌 3개 개설(<code>1,000,000</code> 처럼 쉼표 입력 허용) → 잘못된 종류 → 입금 → 음수 입금(오류) → 마이너스 출금 → 잔액 부족 → 없는 계좌 → 이체 → 같은 계좌 이체(오류) → 숫자가 아닌 금액(다시 묻기) 후 잔액 부족 → 이자 지급 → 내역 → 계좌 목록 → 보고서 → 잘못된 메뉴 → 종료. 모든 오류가 <code>Main</code> 의 catch 한 곳에서 <code>[오류]</code> 로 처리되는 것을 확인하세요.' },
          { type: 'h', text: '테스트 — 불변 조건마다 확인하기' },
          { type: 'table', head: ['불변 조건', '시험한 입력', '결과'], rows: [
            ['금액 &gt; 0', '입금 −3,000', '[오류] 금액은 0보다 커야 합니다 ✔'],
            ['출금 ≤ 출금 가능 금액', '저축예금 50만에서 60만 출금 / 이체 500만', '[오류] 잔액이 부족합니다 ✔'],
            ['마이너스 한도', '마이너스통장 10만에서 45만 출금', '성공, 잔액 −350,000 ✔'],
            ['있는 계좌만', '999-9999', '[오류] 계좌를 찾을 수 없습니다 ✔'],
            ['이체 원자성', '잔액 부족 이체 후 두 계좌 내역', '실패한 이체는 흔적 없음 ✔'],
            ['잔액 변화 = 내역', '220-0002 내역 3건 = 개설 · 출금 · 이체입금', '✔'],
            ['멈추지 않음', '잘못된 종류 · 숫자 아닌 금액 · 없는 메뉴', '안내 후 메뉴로 ✔']
          ] },
          { type: 'h', text: '확장 아이디어' },
          { type: 'list', items: [
            '<b>거래 내역 CSV 내보내기</b> (실습 P2-7)',
            '<b>월말 결산</b>: 이자 지급 + 마이너스 대출 이자 + 결산 보고서 (실습 P2-8)',
            '계좌 <b>해지</b>: 잔액이 0 일 때만 가능, 해지된 계좌는 거래 금지 (새 예외 <code>AccountClosedException</code>)',
            '<b>비밀번호</b>: 출금 · 이체 전에 4자리 확인, 3번 틀리면 잠금',
            '<b>정기 이체</b>: 매달 1일 자동 이체 — FakeClock 으로 한 달을 흘려보내며 시험',
            '계좌 목록과 내역을 파일로 저장 · 불러오기 (P01 의 CSV 기법)'
          ] },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 단위 테스트 프로젝트', html: 'Visual Studio 에서 솔루션에 <b>xUnit 테스트 프로젝트</b>를 추가하면, <code>[Fact] public void 잔액보다_많이_출금하면_예외() { … Assert.Throws&lt;InsufficientFundsException&gt;(() =&gt; acc.Withdraw(…)); }</code> 처럼 규칙마다 테스트 메서드를 만들어 <b>테스트 탐색기</b>에서 한 번에 실행할 수 있습니다. 오늘 <code>IClock</code> 으로 시간을 주입한 설계가 바로 이런 자동 테스트를 가능하게 해 줍니다.' }
        ],
        practice: [
          {
            title: '실습 P2-7. [확장] 거래 내역 CSV 내보내기',
            level: 2,
            desc: '<p>계좌의 거래 내역을 <code>{계좌번호}.csv</code> 파일로 내보내는 <code>ExportCsv(Account acc)</code> 를 만드세요. 첫 줄은 머리글 <code>일시,종류,금액,잔액,메모</code>, 일시 형식은 <code>yyyy-MM-dd HH:mm</code>, 금액은 쉼표 없는 숫자입니다. 파일을 만든 뒤 내용을 읽어 화면에 출력합니다.</p>',
            hint: '<code>var lines = new List&lt;string&gt; { "일시,종류,금액,잔액,메모" }; lines.AddRange(acc.History.Select(t =&gt; $"{t.Date:yyyy-MM-dd HH:mm},{t.Kind},{t.Amount},{t.BalanceAfter},{t.Memo}"));</code>',
            starter: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNTS}

class Program
{
    static string ExportCsv(Account acc)
    {
        string path = $"{acc.Number}.csv";
        // TODO: 머리글 + 거래마다 한 줄 → File.WriteAllLines
        return path;
    }

    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));
        var acc = new CheckingAccount("220-0002", "이서연", clock, 500000);
        acc.Deposit(100000, "급여");
        clock.Advance(TimeSpan.FromHours(2));
        acc.Withdraw(250000, "노트북");
        clock.Advance(TimeSpan.FromDays(1));
        acc.Deposit(30000, "용돈");

        string path = ExportCsv(acc);
        Console.WriteLine($"{path} 저장");
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNTS}

class Program
{
    static string ExportCsv(Account acc)
    {
        string path = $"{acc.Number}.csv";
        var lines = new List<string> { "일시,종류,금액,잔액,메모" };
        lines.AddRange(acc.History.Select(t =>
            $"{t.Date:yyyy-MM-dd HH:mm},{t.Kind},{t.Amount},{t.BalanceAfter},{t.Memo}"));
        File.WriteAllLines(path, lines);
        return path;
    }

    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 3, 9, 0, 0));
        var acc = new CheckingAccount("220-0002", "이서연", clock, 500000);
        acc.Deposit(100000, "급여");
        clock.Advance(TimeSpan.FromHours(2));
        acc.Withdraw(250000, "노트북");
        clock.Advance(TimeSpan.FromDays(1));
        acc.Deposit(30000, "용돈");

        string path = ExportCsv(acc);
        Console.WriteLine($"{path} 저장");
        Console.Write(File.ReadAllText(path));
    }
}`,
            expect: `220-0002.csv 저장
일시,종류,금액,잔액,메모
2025-03-03 09:00,입금,100000,100000,급여
2025-03-03 11:00,출금,-250000,-150000,노트북
2025-03-04 11:00,입금,30000,-120000,용돈`
          },
          {
            title: '실습 P2-8. [확장] 월말 결산',
            level: 3,
            desc: '<p>은행에 <code>MonthEnd()</code> 를 추가하세요. ① 이자 계좌(<code>IInterestBearing</code>)에 이자 지급, ② 잔액이 음수인 마이너스통장에는 음수 잔액의 1%(원 미만 버림)를 <b>대출 이자</b>로 부과(한도와 무관하게), ③ 결과를 <code>(지급 이자 합계, 대출 이자 합계)</code> 튜플로 돌려줍니다. 테스트 시계를 3월 31일 23:59 로 맞춘 뒤 1분 흘려 4월 1일 0시에 결산하세요.</p>',
            hint: '대출 이자는 <code>CheckingAccount</code> 에 <code>public decimal ChargeLoanInterest(decimal rate)</code> 를 추가해 <code>Change(-fee, "출금", "대출 이자")</code> 로 처리합니다(Change 는 protected 라 파생 클래스 안에서만 호출 가능). 튜플: <code>return (paid, charged);</code>',
            starter: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNTS}

class LoanChecking : CheckingAccount
{
    public LoanChecking(string number, string owner, IClock clock, decimal limit) : base(number, owner, clock, limit) { }
    // TODO: public decimal ChargeLoanInterest(decimal rate)
}

class Program
{
    static (decimal paid, decimal charged) MonthEnd(List<Account> accounts)
    {
        decimal paid = 0, charged = 0;
        // TODO: 이자 지급 + 대출 이자 부과
        return (paid, charged);
    }

    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 31, 23, 59, 0));
        var accounts = new List<Account>
        {
            new SavingsAccount("110-0001", "김민준", clock, 0.025m),
            new LoanChecking("220-0002", "이서연", clock, 1000000),
            new SavingsAccount("110-0003", "박지호", clock, 0.03m)
        };
        accounts[0].Deposit(800000);
        accounts[1].Withdraw(345678);
        accounts[2].Deposit(123456);

        clock.Advance(TimeSpan.FromMinutes(1));
        var (paid, charged) = MonthEnd(accounts);
        Console.WriteLine($"[{clock.Now:yyyy-MM-dd HH:mm} 결산] 지급 이자 {paid:N0}원, 대출 이자 {charged:N0}원");
        foreach (Account a in accounts) Console.WriteLine(a);
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_EXC}

${CS_CLOCK}

${CS_TX}

${CS_ACCOUNTS}

class LoanChecking : CheckingAccount
{
    public LoanChecking(string number, string owner, IClock clock, decimal limit) : base(number, owner, clock, limit) { }

    public decimal ChargeLoanInterest(decimal rate)
    {
        if (Balance >= 0) return 0;
        decimal fee = Math.Floor(-Balance * rate);
        if (fee > 0) Change(-fee, "출금", "대출 이자");
        return fee;
    }
}

class Program
{
    static (decimal paid, decimal charged) MonthEnd(List<Account> accounts)
    {
        decimal paid = accounts.OfType<IInterestBearing>().Sum(a => a.ApplyInterest());
        decimal charged = accounts.OfType<LoanChecking>().Sum(a => a.ChargeLoanInterest(0.01m));
        return (paid, charged);
    }

    static void Main()
    {
        var clock = new FakeClock(new DateTime(2025, 3, 31, 23, 59, 0));
        var accounts = new List<Account>
        {
            new SavingsAccount("110-0001", "김민준", clock, 0.025m),
            new LoanChecking("220-0002", "이서연", clock, 1000000),
            new SavingsAccount("110-0003", "박지호", clock, 0.03m)
        };
        accounts[0].Deposit(800000);
        accounts[1].Withdraw(345678);
        accounts[2].Deposit(123456);

        clock.Advance(TimeSpan.FromMinutes(1));
        var (paid, charged) = MonthEnd(accounts);
        Console.WriteLine($"[{clock.Now:yyyy-MM-dd HH:mm} 결산] 지급 이자 {paid:N0}원, 대출 이자 {charged:N0}원");
        foreach (Account a in accounts) Console.WriteLine(a);
    }
}`,
            expect: `[2025-04-01 00:00 결산] 지급 이자 23,703원, 대출 이자 3,456원
[저축예금] 110-0001 김민준 잔액 820,000원
[마이너스통장] 220-0002 이서연 잔액 -349,134원
[저축예금] 110-0003 박지호 잔액 127,159원`
          }
        ],
        quiz: [
          { q: '<code>accounts.SelectMany(a =&gt; a.History)</code> 의 결과는?', options: ['계좌마다 거래 목록이 하나씩 든 목록의 목록', '모든 계좌의 거래를 하나로 펼친 거래 목록', '거래가 있는 계좌 목록', '거래 수의 합계'], answer: 1, explain: 'Select 는 “목록의 목록” 을 만들지만 SelectMany 는 안쪽 목록들을 이어 붙여 하나의 평평한 시퀀스로 만듭니다.' },
          { q: '완성 프로그램에서 입금 · 출금 · 이체 메서드에 try/catch 가 없는데도 오류로 멈추지 않는 이유는?', options: ['예외가 발생하지 않기 때문', '메뉴 반복(Main)의 catch (BankException) 이 호출한 쪽에서 모두 받아 주기 때문', 'decimal 은 예외가 나지 않아서', 'FakeClock 이 예외를 막아서'], answer: 1, explain: '예외는 호출 스택을 거슬러 올라가며 맞는 catch 를 찾습니다. 한 곳(Main)에 모아 처리하면 각 기능 메서드는 정상 흐름만 쓰면 됩니다.' },
          { q: '다음 코드의 출력은?<pre><code>var owners = new[] { "김민준", "이서연", "김민준" };\nConsole.WriteLine(owners.Distinct().Count());</code></pre>', options: ['1', '2', '3', '0'], answer: 1, explain: 'Distinct 는 중복을 제거합니다. 김민준, 이서연 → 2.' },
          { q: '실제 서비스로 바꿀 때 가장 적게 고치는 방법은? (지금은 <code>FakeClock</code> 사용)', options: ['Account 의 모든 clock.Now 를 DateTime.Now 로 바꾼다', 'Program 에서 시계를 만드는 한 곳을 new SystemClock() 으로 바꾼다', 'Transaction 클래스를 지운다', 'IClock 인터페이스를 지운다'], answer: 1, explain: '계좌와 은행은 IClock 에만 의존하므로 시계를 만드는 한 줄만 바꾸면 됩니다. 이것이 의존성 주입의 장점입니다.' }
        ],
        slides: [
          { layout: 'title', title: '완성과 확장', subtitle: 'Project 02 · 은행 계좌 관리 — 4교시', badge: 'P02-4',
            notes: '<p><b>[복습 3분]</b> 지금까지 만든 클래스 그림(1교시)을 다시 띄우고, 모든 상자가 채워졌음을 확인합니다. 오늘은 보고서 · 메뉴 · 테스트.</p>' },
          { layout: 'table', title: '단계 7 — 보고서 질문 → LINQ', head: ['질문', 'LINQ'], rows: [['고객 수', '<code>Select(a =&gt; a.Owner).Distinct().Count()</code>'], ['예금 합계', '<code>Where(a =&gt; a.Balance &gt; 0).Sum(…)</code>'], ['종류별', '<code>GroupBy(a =&gt; a.KindName)</code>'], ['모든 거래', '<code>SelectMany(a =&gt; a.History)</code>'], ['1위', '<code>MaxBy(a =&gt; a.Balance)</code>']],
            lead: '질문을 먼저 쓰고, LINQ 로 옮긴다',
            notes: '<p><b>[4분]</b> 학생들에게 은행장이 궁금해할 질문을 먼저 말하게 한 뒤 LINQ 로 옮겨 봅니다. SelectMany 는 처음 나오므로 다음 슬라이드에서 따로 설명.</p>' },
          { layout: 'code', title: 'SelectMany — 목록의 목록을 펼치기', code: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        var histories = new Dictionary<string, List<int>>
        {
            ["김민준"] = new List<int> { 100000, -30000 },
            ["이서연"] = new List<int> { 20000, 30000, -5000 }
        };
        var nested = histories.Select(h => h.Value);        // 목록의 목록
        var flat = histories.SelectMany(h => h.Value);      // 한 줄로 펼침
        Console.WriteLine($"Select: {nested.Count()}개 목록");
        Console.WriteLine($"SelectMany: {flat.Count()}건, 합계 {flat.Sum():N0}");
        Console.WriteLine($"입금 {flat.Count(x => x > 0)}건, 출금 {flat.Count(x => x < 0)}건");
    }
}`, points: ['<code>Select</code>: 2개의 목록', '<code>SelectMany</code>: 5건의 거래', '펼친 뒤에는 Sum · Count · GroupBy 자유롭게'],
            notes: '<p><b>[4분]</b> 비유: 반마다 있는 학생 명단(목록의 목록)을 전교생 명단 하나로 합치는 것.</p>' },
          { layout: 'code', title: 'GroupBy + 익명 형식', code: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        var accounts = new[]
        {
            (Owner: "김민준", Balance: 820000m), (Owner: "이서연", Balance: -150000m),
            (Owner: "박지호", Balance: 515000m), (Owner: "김민준", Balance: -100000m)
        };
        var report = accounts.GroupBy(a => a.Owner)
                             .Select(g => new { Owner = g.Key, Count = g.Count(), Total = g.Sum(a => a.Balance) })
                             .OrderByDescending(x => x.Total);
        foreach (var x in report)
            Console.WriteLine($"{x.Owner}: 계좌 {x.Count}개, {x.Total:N0}원");
    }
}`, points: ['<code>GroupBy(a =&gt; a.Owner)</code>: 고객별로 묶기', '<code>new { … }</code>: 익명 형식', '묶은 뒤 정렬'],
            notes: '<p><b>[4분]</b> 슬라이드에서는 튜플 배열로 계좌를 흉내 냈습니다. 본문 단계 7 은 실제 Bank 와 계좌 객체로 같은 보고서를 만듭니다.</p>' },
          { layout: 'bullets', title: '완성 — 예외는 한 곳에서', lead: '기능 메서드는 정상 흐름만, 오류는 Main 의 catch 가',
            bullets: ['<code>try { switch (input) { … } }</code>', '<code>catch (BankException ex) { [오류] 출력 }</code>', 'Deposit · Withdraw · Transfer 에는 try 가 없다', '예외는 호출 스택을 거슬러 올라가 catch 를 찾는다', '시계: FakeClock → 실제는 SystemClock 한 줄 교체'],
            notes: '<p><b>[5분]</b> 완성 프로그램을 실행하며 [오류] 가 나오는 곳마다 “이 예외는 어디서 던져졌을까?” 를 물어봅니다(Account.Withdraw, Bank.Find, Program.Open …).</p>' },
          { layout: 'table', title: '파일 구성', head: ['파일', '내용'], rows: [['BankExceptions.cs', '예외 4개'], ['Clock.cs', 'IClock · SystemClock · FakeClock'], ['Transaction.cs', '거래'], ['Accounts.cs', 'IInterestBearing · Account · Savings · Checking'], ['Bank.cs', 'Dictionary · 개설 · 찾기 · 이체'], ['Program.cs', '메뉴 · 입출력 · 보고서']],
            lead: 'Console 은 Program.cs 에만',
            notes: '<p><b>[3분]</b> Visual Studio 에서 Ctrl+. → “파일 이름으로 형식 이동” 을 시연하면 학생들이 매우 좋아합니다.</p>' },
          { layout: 'table', title: '테스트 — 불변 조건 체크', head: ['불변 조건', '입력', '결과'], rows: [['금액 &gt; 0', '입금 −3,000', '[오류] ✔'], ['출금 ≤ 가능 금액', '60만 / 500만', '[오류] ✔'], ['마이너스 한도', '45만 출금', '−350,000 ✔'], ['있는 계좌만', '999-9999', '[오류] ✔'], ['멈추지 않음', '잘못된 메뉴 · 숫자 아닌 금액', '안내 ✔']],
            lead: '1교시 규칙표 = 오늘의 테스트 목록',
            notes: '<p><b>[5분]</b> 학생들에게 “규칙을 깨뜨릴 수 있는 입력” 을 찾아보게 하세요. 찾아내면 새 테스트 줄로 추가합니다.</p>' },
          { layout: 'bullets', title: '확장 과제', lead: '새 기능 = 새 클래스 · 새 메서드 추가',
            bullets: ['거래 내역 CSV 내보내기 (실습 P2-7)', '월말 결산: 이자 + 대출 이자 (실습 P2-8)', '계좌 해지 + <code>AccountClosedException</code>', '비밀번호 확인 · 잠금', '정기 이체 — FakeClock 으로 한 달 흘려보내기'],
            notes: '<p><b>[12분]</b> P2-7 → P2-8 순서. 해지 기능은 “해지된 계좌에 입금하면?” 이라는 새 불변 조건을 스스로 설계하게 하는 좋은 과제입니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'Select 와 SelectMany 의 차이로 옳은 것은?', options: ['차이가 없다', 'SelectMany 는 안쪽 목록들을 이어 붙여 하나로 펼친다', 'SelectMany 는 여러 번 정렬한다', 'Select 는 목록을 지운다'], answer: 1, explain: '계좌마다 거래 목록이 있을 때 SelectMany 로 모든 거래를 하나의 시퀀스로 만들 수 있습니다.',
            notes: '<p><b>[2분]</b> 답을 확인한 뒤 “보고서의 거래 유형별 합계에서 SelectMany 대신 Select 를 쓰면?” → 컴파일 오류(목록에는 Kind 가 없다).</p>' },
          { layout: 'practice', title: '실습 P2-7. 거래 내역 CSV', desc: '머리글 <code>일시,종류,금액,잔액,메모</code> + 거래마다 한 줄을 <code>{계좌번호}.csv</code> 로 저장하고 다시 읽어 출력', starter: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

record Tx(DateTime Date, string Kind, decimal Amount, decimal After, string Memo);

class Program
{
    static void Main()
    {
        var history = new List<Tx>
        {
            new(new DateTime(2025, 3, 3, 9, 0, 0), "입금", 100000, 100000, "급여"),
            new(new DateTime(2025, 3, 3, 11, 0, 0), "출금", -250000, -150000, "노트북")
        };
        // TODO: 머리글 + Select 로 CSV 줄 만들기 → WriteAllLines("220-0002.csv", …)
        Console.WriteLine($"거래 {history.Count}건");
    }
}`, solution: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

record Tx(DateTime Date, string Kind, decimal Amount, decimal After, string Memo);

class Program
{
    static void Main()
    {
        var history = new List<Tx>
        {
            new(new DateTime(2025, 3, 3, 9, 0, 0), "입금", 100000, 100000, "급여"),
            new(new DateTime(2025, 3, 3, 11, 0, 0), "출금", -250000, -150000, "노트북")
        };
        var lines = new List<string> { "일시,종류,금액,잔액,메모" };
        lines.AddRange(history.Select(t => $"{t.Date:yyyy-MM-dd HH:mm},{t.Kind},{t.Amount},{t.After},{t.Memo}"));
        File.WriteAllLines("220-0002.csv", lines);
        Console.Write(File.ReadAllText("220-0002.csv"));
    }
}`,
            notes: '<p><b>[실습 안내]</b> 금액에 <code>:N0</code> 을 쓰면 “100,000” 의 쉼표 때문에 CSV 칸이 밀린다는 점을 먼저 질문하세요. 그래서 금액은 형식 없이 씁니다.</p>' },
          { layout: 'summary', title: '프로젝트 정리', bullets: ['캡슐화: <code>private set</code> + 잔액 변경은 <code>Change</code> 한 곳', '사용자 정의 예외 계층 + catch 한 곳', '<code>IClock</code> 주입으로 시간도 테스트 가능', '추상 클래스 · virtual/override · 인터페이스 → 다형성', 'LINQ 보고서: <code>SelectMany</code> · <code>GroupBy</code> · <code>MaxBy</code>', '다음 프로젝트 P03: 상속 · Random(시드) · enum · 콘솔 색으로 텍스트 게임'],
            notes: '<p>1교시 규칙표 → 3교시 클래스 → 4교시 테스트로 이어지는 흐름을 정리합니다. “규칙을 먼저 쓰고, 그 규칙을 지키는 구조를 만들었다.” 다음 P03 에서는 같은 객체지향 기법으로 게임을 만듭니다.</p>' }
        ]
      }
    ]
  });
})();
