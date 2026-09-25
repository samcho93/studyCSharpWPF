/* Project 03. 콘솔 텍스트 게임 — 던전 탐험 RPG (Console Text RPG) */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  /* ---------- 여러 예제에서 함께 쓰는 C# 코드 조각 ---------- */
  const CS_ENUMS = `enum GameState { Exploring, Victory, GameOver, Quit }
enum ItemType { Potion, Bomb, Elixir }
enum RoomType { Monster, Treasure, Fountain, Boss }
enum BattleResult { Won, Fled, Lost }

static class Items
{
    public static string Name(ItemType t) => t switch
    {
        ItemType.Potion => "포션",
        ItemType.Bomb => "폭탄",
        ItemType.Elixir => "엘릭서",
        _ => t.ToString()
    };
}`;

  const CS_SCREEN = `static class Screen
{
    // 글자색을 바꿔 한 줄 출력하고 원래 색으로 되돌린다
    public static void Say(string text, ConsoleColor color)
    {
        Console.ForegroundColor = color;
        Console.WriteLine(text);
        Console.ResetColor();
    }
}`;

  const CS_CHARACTER = `abstract class Character
{
    public string Name { get; }
    public int MaxHp { get; protected set; }
    public int Hp { get; protected set; }
    public int Attack { get; protected set; }
    public int Defense { get; protected set; }
    public bool IsAlive => Hp > 0;

    protected Character(string name, int hp, int attack, int defense)
    {
        Name = name; MaxHp = hp; Hp = hp; Attack = attack; Defense = defense;
    }

    // 공격력(power)에서 방어력을 뺀 만큼 피해를 입는다 (최소 1). 실제 피해량을 돌려준다
    public virtual int TakeDamage(int power)
    {
        int damage = Math.Max(1, power - Defense);
        Hp = Math.Max(0, Hp - damage);
        return damage;
    }

    // 최대 HP 를 넘지 않게 회복하고, 실제로 회복한 양을 돌려준다
    public int Heal(int amount)
    {
        int before = Hp;
        Hp = Math.Min(MaxHp, Hp + amount);
        return Hp - before;
    }

    public string HpBar()
    {
        int filled = Hp * 10 / MaxHp;                       // 10칸 막대
        return $"[{new string('#', filled)}{new string('.', 10 - filled)}] {Hp}/{MaxHp}";
    }
}`;

  const CS_HERO = `class Hero : Character
{
    public int Level { get; private set; } = 1;
    public int Exp { get; private set; }
    public int Gold { get; set; }
    public bool Defending { get; set; }
    public Dictionary<ItemType, int> Bag { get; } = new Dictionary<ItemType, int>
    {
        [ItemType.Potion] = 2, [ItemType.Bomb] = 1, [ItemType.Elixir] = 0
    };

    public Hero(string name) : base(name, 60, 12, 3) { }

    public int ExpToNext => Level * 20;

    // 방어 중이면 받는 공격력이 절반
    public override int TakeDamage(int power) => base.TakeDamage(Defending ? power / 2 : power);

    // 경험치를 얻고, 레벨이 하나라도 올랐으면 true
    public bool GainExp(int amount)
    {
        Exp += amount;
        bool up = false;
        while (Exp >= ExpToNext)
        {
            Exp -= ExpToNext;
            Level++;
            MaxHp += 10; Attack += 3; Defense += 1;
            Hp = MaxHp;
            up = true;
        }
        return up;
    }

    public void AddItem(ItemType type, int count = 1) => Bag[type] = Bag.GetValueOrDefault(type) + count;

    public string UseItem(ItemType type, Character? enemy)
    {
        if (Bag.GetValueOrDefault(type) == 0) return $"{Items.Name(type)}이(가) 없다!";
        switch (type)
        {
            case ItemType.Potion:
                Bag[type]--;
                return $"포션을 마셨다. HP +{Heal(30)}";
            case ItemType.Elixir:
                Bag[type]--;
                return $"엘릭서를 마셨다. HP +{Heal(MaxHp)}";
            case ItemType.Bomb:
                if (enemy == null) return "폭탄을 던질 상대가 없다.";
                Bag[type]--;
                return $"폭탄을 던졌다! {enemy.Name}에게 {enemy.TakeDamage(25 + enemy.Defense)}의 피해.";
            default:
                return "알 수 없는 아이템";
        }
    }

    public string BagText() => string.Join(", ", Bag.Select(kv => $"{Items.Name(kv.Key)} x{kv.Value}"));

    // 저장 파일에서 불러올 때 능력치를 되살린다
    public void Restore(int level, int exp, int hp, int maxHp, int attack, int defense, int gold)
    {
        Level = level; Exp = exp; MaxHp = maxHp; Hp = hp; Attack = attack; Defense = defense; Gold = gold;
    }
}`;

  const CS_MONSTERS = `class Monster : Character
{
    public int ExpReward { get; }
    public int GoldReward { get; }

    public Monster(string name, int hp, int attack, int defense, int exp, int gold)
        : base(name, hp, attack, defense)
    {
        ExpReward = exp; GoldReward = gold;
    }

    // 몬스터의 차례: 무엇을 할지 정해 (설명, 공격력) 을 돌려준다 — 종류마다 재정의
    public virtual (string Text, int Power) ChooseAttack(Random rng, int turn) =>
        ($"{Name}의 공격!", Attack + rng.Next(-2, 3));
}

class Slime : Monster
{
    public Slime() : base("슬라임", 20, 7, 0, 8, 5) { }
}

class Goblin : Monster
{
    public Goblin() : base("고블린", 32, 10, 2, 14, 12) { }

    public override (string Text, int Power) ChooseAttack(Random rng, int turn)
    {
        if (rng.Next(100) < 30)                                      // 30% 확률로 연속 베기
            return ($"{Name}이 단검을 두 번 휘둘렀다!", Attack * 2 - 4);
        return base.ChooseAttack(rng, turn);
    }
}

class Dragon : Monster
{
    public Dragon() : base("드래곤", 80, 13, 4, 100, 100) { }

    public override (string Text, int Power) ChooseAttack(Random rng, int turn)
    {
        if (turn % 3 == 0)                                           // 3턴마다 브레스 — 방어로 대비!
            return ($"{Name}이 불꽃 브레스를 뿜었다!!", 26);
        return base.ChooseAttack(rng, turn);
    }
}`;

  const CS_BATTLE = `static class Battle
{
    public static BattleResult Fight(Hero hero, Monster enemy, Random rng)
    {
        Screen.Say($"{enemy.Name}(이)가 나타났다!", ConsoleColor.Yellow);
        for (int turn = 1; ; turn++)
        {
            Console.WriteLine($"--- {turn}턴 ---  {hero.Name} {hero.HpBar()}  |  {enemy.Name} {enemy.HpBar()}");
            Console.Write("1.공격 2.방어 3.아이템 4.도망 > ");
            string cmd = (Console.ReadLine() ?? "1").Trim();          // 입력이 끝나면 공격
            hero.Defending = false;
            switch (cmd)
            {
                case "1":
                    int power = hero.Attack + rng.Next(-2, 3);          // -2 ~ +2 흔들림
                    bool critical = rng.Next(100) < 15;                   // 15% 치명타
                    if (critical) power *= 2;
                    int damage = enemy.TakeDamage(power);
                    Screen.Say($"{hero.Name}의 공격!{(critical ? " 치명타!" : "")} {enemy.Name}에게 {damage}의 피해.",
                               critical ? ConsoleColor.Yellow : ConsoleColor.White);
                    break;
                case "2":
                    hero.Defending = true;
                    Screen.Say($"{hero.Name}은(는) 방패를 들었다. (받는 피해 절반)", ConsoleColor.Cyan);
                    break;
                case "3":
                    ItemType? item = AskItem(hero);
                    Console.WriteLine(item == null ? "아이템을 쓰지 않았다." : hero.UseItem(item.Value, enemy));
                    break;
                case "4":
                    if (rng.Next(100) < 50)
                    {
                        Screen.Say("무사히 도망쳤다!", ConsoleColor.Cyan);
                        return BattleResult.Fled;
                    }
                    Console.WriteLine("도망치지 못했다!");
                    break;
                default:
                    Console.WriteLine("머뭇거리는 사이 기회를 놓쳤다...");
                    break;
            }

            if (!enemy.IsAlive)
            {
                Screen.Say($"{enemy.Name}을(를) 쓰러뜨렸다! 경험치 +{enemy.ExpReward}, 골드 +{enemy.GoldReward}", ConsoleColor.Green);
                hero.Gold += enemy.GoldReward;
                if (hero.GainExp(enemy.ExpReward))
                    Screen.Say($"레벨 업! Lv.{hero.Level} (HP {hero.MaxHp}, 공격 {hero.Attack}, 방어 {hero.Defense})", ConsoleColor.Magenta);
                return BattleResult.Won;
            }

            var (text, enemyPower) = enemy.ChooseAttack(rng, turn);
            int taken = hero.TakeDamage(enemyPower);
            Screen.Say($"{text} {hero.Name}에게 {taken}의 피해!", ConsoleColor.Red);
            if (!hero.IsAlive)
            {
                Screen.Say($"{hero.Name}은(는) 쓰러졌다...", ConsoleColor.DarkRed);
                return BattleResult.Lost;
            }
        }
    }

    // 가방을 보여 주고 번호로 고르게 한다. 취소 · 잘못된 번호면 null
    public static ItemType? AskItem(Hero hero)
    {
        Console.Write($"가방: {hero.BagText()} | 번호(1.포션 2.폭탄 3.엘릭서, 0.취소) > ");
        string? line = Console.ReadLine();
        if (int.TryParse(line, out int n) && Enum.IsDefined(typeof(ItemType), n - 1))
            return (ItemType)(n - 1);
        return null;
    }
}`;

  const CS_GAME = `class Game
{
    private readonly Hero hero;
    private readonly Random rng;
    private readonly RoomType[] map =
        { RoomType.Monster, RoomType.Treasure, RoomType.Monster, RoomType.Fountain, RoomType.Monster, RoomType.Boss };
    private int room;                                   // 지금 있는 방 (0부터)
    private GameState state = GameState.Exploring;

    public Game(Hero hero, Random rng, int room = 0)
    {
        this.hero = hero; this.rng = rng; this.room = room;
    }

    public GameState Run()
    {
        while (state == GameState.Exploring)
        {
            Console.WriteLine();
            Console.WriteLine($"[방 {room + 1}/{map.Length}] {hero.Name} Lv.{hero.Level} {hero.HpBar()} 골드 {hero.Gold}");
            Console.Write("1.앞으로 2.상태 3.아이템 4.저장 0.포기 > ");
            string? cmd = Console.ReadLine();
            switch (cmd?.Trim())
            {
                case null:
                case "0": state = GameState.Quit; break;
                case "1": EnterRoom(); break;
                case "2": ShowStatus(); break;
                case "3":
                    ItemType? item = Battle.AskItem(hero);
                    Console.WriteLine(item == null ? "아이템을 쓰지 않았다." : hero.UseItem(item.Value, null));
                    break;
                case "4": Save(SaveFile); break;
                default: Console.WriteLine("잘못된 선택입니다."); break;
            }
        }
        return state;
    }

    private void EnterRoom()
    {
        switch (map[room])
        {
            case RoomType.Monster:
                Monster monster = rng.Next(100) < 50 ? new Slime() : new Goblin();
                BattleResult result = Battle.Fight(hero, monster, rng);
                if (result == BattleResult.Won) room++;
                else if (result == BattleResult.Lost) state = GameState.GameOver;
                break;                                  // 도망치면 같은 방에 머문다
            case RoomType.Treasure:
                int gold = rng.Next(10, 31);
                ItemType item = (ItemType)rng.Next(3);   // 0~2 → 아이템 종류
                hero.Gold += gold;
                hero.AddItem(item);
                Screen.Say($"보물 상자! 골드 {gold} 와 {Items.Name(item)} 1개를 얻었다.", ConsoleColor.Yellow);
                room++;
                break;
            case RoomType.Fountain:
                Screen.Say($"신비한 샘물을 마셨다. HP +{hero.Heal(hero.MaxHp / 2)}", ConsoleColor.Green);
                room++;
                break;
            case RoomType.Boss:
                Screen.Say("거대한 문이 열린다... 던전의 주인이 깨어났다!", ConsoleColor.DarkYellow);
                BattleResult boss = Battle.Fight(hero, new Dragon(), rng);
                state = boss switch
                {
                    BattleResult.Won => GameState.Victory,
                    BattleResult.Lost => GameState.GameOver,
                    _ => GameState.Exploring
                };
                break;
        }
    }

    private void ShowStatus()
    {
        Console.WriteLine($"{hero.Name} Lv.{hero.Level}  경험치 {hero.Exp}/{hero.ExpToNext}  공격 {hero.Attack}  방어 {hero.Defense}");
        Console.WriteLine($"가방: {hero.BagText()}  골드 {hero.Gold}");
    }

    public const string SaveFile = "save.txt";

    public void Save(string path)
    {
        var lines = new List<string>
        {
            $"name={hero.Name}", $"level={hero.Level}", $"exp={hero.Exp}", $"hp={hero.Hp}", $"maxhp={hero.MaxHp}",
            $"attack={hero.Attack}", $"defense={hero.Defense}", $"gold={hero.Gold}", $"room={room}"
        };
        foreach (var kv in hero.Bag)
            lines.Add($"{kv.Key}={kv.Value}");          // enum 이름 그대로: Potion=2
        File.WriteAllLines(path, lines);
        Screen.Say($"{path} 에 저장했습니다.", ConsoleColor.Cyan);
    }

    public static bool TryLoad(string path, Random rng, out Game? game)
    {
        game = null;
        if (!File.Exists(path)) return false;
        var data = new Dictionary<string, string>();
        foreach (string line in File.ReadAllLines(path))
        {
            int eq = line.IndexOf('=');
            if (eq > 0) data[line.Substring(0, eq)] = line.Substring(eq + 1);
        }
        try
        {
            var hero = new Hero(data["name"]);
            hero.Restore(int.Parse(data["level"]), int.Parse(data["exp"]), int.Parse(data["hp"]), int.Parse(data["maxhp"]),
                         int.Parse(data["attack"]), int.Parse(data["defense"]), int.Parse(data["gold"]));
            foreach (var kv in data)
                if (Enum.TryParse(kv.Key, out ItemType type) && int.TryParse(kv.Value, out int count))
                    hero.Bag[type] = count;
            game = new Game(hero, rng, int.Parse(data["room"]));
            return true;
        }
        catch (Exception ex) when (ex is KeyNotFoundException || ex is FormatException)
        {
            Console.WriteLine("저장 파일이 손상되어 불러올 수 없습니다.");
            return false;
        }
    }

    public void PrintSummary()
    {
        Console.WriteLine($"{hero.Name}: Lv.{hero.Level}, HP {hero.Hp}/{hero.MaxHp}, 골드 {hero.Gold}, 도달한 방 {room + 1}/{map.Length}");
    }
}`;

  /* ---------- SVG 그림 ---------- */
  const SVG_CLASS = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="텍스트 RPG 의 클래스 설계">
  <defs><marker id="ap3a" markerWidth="16" markerHeight="16" refX="14" refY="8" orient="auto" viewBox="0 0 16 16" markerUnits="userSpaceOnUse"><path d="M0,0 L16,8 L0,16 z" fill="var(--card)" stroke="var(--accent)" stroke-width="2"/></marker></defs>
  <rect x="400" y="20" width="480" height="200" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <rect x="400" y="20" width="480" height="52" rx="12" fill="var(--accent)" opacity="0.18"/>
  <text x="640" y="55" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--fg)">abstract class Character</text>
  <g style="${MONO};font-size:18px;fill:var(--fg)">
    <text x="420" y="102">Name · Hp/MaxHp · Attack · Defense</text>
    <text x="420" y="132">IsAlive =&gt; Hp &gt; 0</text>
    <text x="420" y="162" fill="var(--accent2)">virtual TakeDamage(power)</text>
    <text x="420" y="192">Heal(amount) · HpBar()</text>
  </g>
  <rect x="40" y="300" width="440" height="220" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="260" y="336" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">class Hero (용사)</text>
  <g style="${MONO};font-size:17px;fill:var(--fg)">
    <text x="60" y="370">Level · Exp · Gold · Defending</text>
    <text x="60" y="398">Dictionary&lt;ItemType, int&gt; Bag</text>
    <text x="60" y="426" fill="var(--accent2)">override TakeDamage (방어 시 절반)</text>
    <text x="60" y="454">GainExp() → 레벨 업</text>
    <text x="60" y="482">UseItem(type, enemy)</text>
    <text x="60" y="508">Restore() — 불러오기</text>
  </g>
  <rect x="560" y="300" width="330" height="150" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="725" y="336" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">class Monster</text>
  <g style="${MONO};font-size:17px;fill:var(--fg)">
    <text x="580" y="370">ExpReward · GoldReward</text>
    <text x="580" y="400" fill="var(--accent2)">virtual ChooseAttack(rng, turn)</text>
    <text x="580" y="428" style="font-size:16px;fill:var(--muted)">→ (Text, Power) 튜플</text>
  </g>
  <g style="font-size:18px;fill:var(--fg)">
    <rect x="960" y="270" width="290" height="60" rx="10" fill="var(--card)" stroke="var(--danger)" stroke-width="2"/>
    <text x="1105" y="307" text-anchor="middle">Slime — 기본 공격만</text>
    <rect x="960" y="350" width="290" height="60" rx="10" fill="var(--card)" stroke="var(--danger)" stroke-width="2"/>
    <text x="1105" y="387" text-anchor="middle">Goblin — 30% 연속 베기</text>
    <rect x="960" y="430" width="290" height="60" rx="10" fill="var(--card)" stroke="var(--danger)" stroke-width="2"/>
    <text x="1105" y="467" text-anchor="middle">Dragon — 3턴마다 브레스</text>
  </g>
  <g stroke="var(--accent)" stroke-width="3" fill="none">
    <path d="M260,298 L520,226" marker-end="url(#ap3a)"/>
    <path d="M725,298 L700,226" marker-end="url(#ap3a)"/>
    <path d="M958,300 L897,350" marker-end="url(#ap3a)"/>
    <path d="M958,380 L897,380" marker-end="url(#ap3a)"/>
    <path d="M958,460 L897,420" marker-end="url(#ap3a)"/>
  </g>
  <rect x="40" y="20" width="300" height="200" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3" stroke-dasharray="9 6"/>
  <text x="190" y="55" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">enum (열거형)</text>
  <g style="${MONO};font-size:16px;fill:var(--fg)">
    <text x="55" y="92">GameState</text><text x="55" y="114" style="fill:var(--muted)"> Exploring·Victory·GameOver·Quit</text>
    <text x="55" y="144">ItemType</text><text x="55" y="166" style="fill:var(--muted)"> Potion·Bomb·Elixir</text>
    <text x="55" y="196">RoomType · BattleResult</text>
  </g>
  <rect x="940" y="20" width="310" height="200" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="1095" y="55" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">진행 담당</text>
  <g style="${MONO};font-size:17px;fill:var(--fg)">
    <text x="960" y="92">Game — 방 이동 · 상태 기계</text>
    <text x="960" y="122">Battle.Fight — 턴제 전투</text>
    <text x="960" y="152">Screen.Say — 색 출력</text>
    <text x="960" y="182">Random(42) — 고정 시드</text>
  </g>
  <text x="640" y="548" text-anchor="middle" style="font-size:18px;fill:var(--muted)">삼각형 화살표 = 상속 · 몬스터는 ChooseAttack 을 재정의해 저마다 다르게 행동한다 (다형성)</text>
</svg>`;

  const SVG_STATE = `<svg viewBox="0 0 1280 480" width="100%" role="img" aria-label="게임 상태 전이도">
  <defs><marker id="ap3b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--fg)"/></marker></defs>
  <circle cx="90" cy="220" r="14" fill="var(--fg)"/>
  <path d="M106,220 L300,220" stroke="var(--fg)" stroke-width="3" fill="none" marker-end="url(#ap3b)"/>
  <text x="200" y="205" text-anchor="middle" style="font-size:18px;fill:var(--muted)">새 게임 / 불러오기</text>
  <rect x="305" y="150" width="330" height="140" rx="70" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="470" y="210" text-anchor="middle" style="${MONO};font-size:28px;font-weight:700;fill:var(--accent)">Exploring</text>
  <text x="470" y="245" text-anchor="middle" style="font-size:19px;fill:var(--muted)">방 이동 · 전투 · 아이템 · 저장</text>
  <path d="M400,150 C380,60 560,60 540,150" stroke="var(--fg)" stroke-width="3" fill="none" marker-end="url(#ap3b)"/>
  <text x="470" y="62" text-anchor="middle" style="font-size:18px;fill:var(--muted)">while (state == Exploring) — 방마다 반복</text>
  <rect x="860" y="30" width="340" height="100" rx="50" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="1030" y="90" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--ok)">Victory</text>
  <rect x="860" y="170" width="340" height="100" rx="50" fill="var(--card)" stroke="var(--danger)" stroke-width="4"/>
  <text x="1030" y="230" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--danger)">GameOver</text>
  <rect x="860" y="310" width="340" height="100" rx="50" fill="var(--card)" stroke="var(--muted)" stroke-width="4"/>
  <text x="1030" y="370" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--muted)">Quit</text>
  <g stroke="var(--fg)" stroke-width="3" fill="none">
    <path d="M635,190 L855,85" marker-end="url(#ap3b)"/>
    <path d="M637,222 L855,222" marker-end="url(#ap3b)"/>
    <path d="M635,255 L855,355" marker-end="url(#ap3b)"/>
  </g>
  <g style="font-size:18px;fill:var(--fg)">
    <text x="720" y="118" text-anchor="middle">보스 승리</text>
    <text x="745" y="212" text-anchor="middle">HP 0 (BattleResult.Lost)</text>
    <text x="720" y="330" text-anchor="middle">0 선택 · 입력 끝</text>
  </g>
  <text x="640" y="455" text-anchor="middle" style="font-size:20px;fill:var(--muted)">상태를 enum 하나로 관리하면 “지금 무엇을 해야 하는가” 가 분명해진다 — 끝난 뒤 switch (state) 로 결말 출력</text>
</svg>`;

  const SVG_TURN = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="턴제 전투의 한 턴 흐름">
  <defs><marker id="ap3c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--fg)"/></marker></defs>
  <g stroke="var(--fg)" stroke-width="3" fill="none">
    <path d="M250,95 L310,95" marker-end="url(#ap3c)"/>
    <path d="M560,95 L620,95" marker-end="url(#ap3c)"/>
    <path d="M870,95 L920,95" marker-end="url(#ap3c)"/>
    <path d="M1030,145 L1030,215" marker-end="url(#ap3c)"/>
    <path d="M920,265 L870,265" marker-end="url(#ap3c)"/>
    <path d="M620,265 L560,265" marker-end="url(#ap3c)"/>
    <path d="M435,315 L435,380" marker-end="url(#ap3c)"/>
    <path d="M310,265 L140,265 L140,145" marker-end="url(#ap3c)"/>
  </g>
  <rect x="30" y="50" width="220" height="90" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="140" y="90" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">상태 출력</text>
  <text x="140" y="120" text-anchor="middle" style="font-size:17px;fill:var(--muted)">HP 막대 두 개</text>
  <rect x="315" y="50" width="245" height="90" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="437" y="90" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">용사의 선택</text>
  <text x="437" y="120" text-anchor="middle" style="font-size:17px;fill:var(--muted)">공격 · 방어 · 아이템 · 도망</text>
  <rect x="625" y="50" width="245" height="90" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="747" y="90" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">용사의 행동</text>
  <text x="747" y="120" text-anchor="middle" style="font-size:17px;fill:var(--muted)">Random: 흔들림 · 치명타</text>
  <path d="M1030,45 L1140,95 L1030,145 L920,95 z" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="1030" y="102" text-anchor="middle" style="font-size:19px;fill:var(--fg)">적 HP 0?</text>
  <text x="1160" y="80" style="font-size:18px;fill:var(--ok)">예 → 승리</text>
  <text x="1045" y="190" style="font-size:18px;fill:var(--muted)">아니오</text>
  <rect x="920" y="220" width="240" height="90" rx="10" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="1040" y="260" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">적의 행동</text>
  <text x="1040" y="290" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--muted)">enemy.ChooseAttack()</text>
  <rect x="625" y="220" width="245" height="90" rx="10" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="747" y="260" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">피해 계산</text>
  <text x="747" y="290" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--muted)">hero.TakeDamage()</text>
  <path d="M435,215 L560,265 L435,315 L310,265 z" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="435" y="272" text-anchor="middle" style="font-size:19px;fill:var(--fg)">용사 HP 0?</text>
  <rect x="330" y="385" width="210" height="60" rx="30" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="435" y="422" text-anchor="middle" style="font-size:20px;fill:var(--fg)">패배</text>
  <text x="200" y="250" text-anchor="middle" style="font-size:18px;fill:var(--muted)">아니오 → 다음 턴</text>
  <text x="640" y="495" text-anchor="middle" style="font-size:20px;fill:var(--muted)">for (int turn = 1; ; turn++) — 승리 · 패배 · 도망에서 return 으로 빠져나간다</text>
</svg>`;

  const SVG_MAP = `<svg viewBox="0 0 1280 300" width="100%" role="img" aria-label="던전 지도">
  <defs><marker id="ap3d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <g style="font-size:20px;fill:var(--fg)">
    <rect x="20" y="80" width="170" height="120" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
    <text x="105" y="125" text-anchor="middle" font-weight="700">방 1</text><text x="105" y="160" text-anchor="middle">몬스터</text>
    <rect x="230" y="80" width="170" height="120" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="315" y="125" text-anchor="middle" font-weight="700">방 2</text><text x="315" y="160" text-anchor="middle">보물 상자</text>
    <rect x="440" y="80" width="170" height="120" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
    <text x="525" y="125" text-anchor="middle" font-weight="700">방 3</text><text x="525" y="160" text-anchor="middle">몬스터</text>
    <rect x="650" y="80" width="170" height="120" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="735" y="125" text-anchor="middle" font-weight="700">방 4</text><text x="735" y="160" text-anchor="middle">샘물 (회복)</text>
    <rect x="860" y="80" width="170" height="120" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
    <text x="945" y="125" text-anchor="middle" font-weight="700">방 5</text><text x="945" y="160" text-anchor="middle">몬스터</text>
    <rect x="1070" y="70" width="190" height="140" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="5"/>
    <text x="1165" y="125" text-anchor="middle" font-weight="700">방 6</text><text x="1165" y="160" text-anchor="middle">보스 드래곤</text>
  </g>
  <g stroke="var(--muted)" stroke-width="3" fill="none">
    <path d="M192,140 L226,140" marker-end="url(#ap3d)"/><path d="M402,140 L436,140" marker-end="url(#ap3d)"/>
    <path d="M612,140 L646,140" marker-end="url(#ap3d)"/><path d="M822,140 L856,140" marker-end="url(#ap3d)"/>
    <path d="M1032,140 L1066,140" marker-end="url(#ap3d)"/>
  </g>
  <text x="640" y="45" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">RoomType[] map = { Monster, Treasure, Monster, Fountain, Monster, Boss };</text>
  <text x="640" y="255" text-anchor="middle" style="font-size:19px;fill:var(--muted)">몬스터 방의 몬스터(슬라임/고블린) · 보물 내용은 Random(42) 가 정한다 — 같은 선택이면 언제나 같은 모험</text>
</svg>`;

  const SVG_SEED = `<svg viewBox="0 0 1280 360" width="100%" role="img" aria-label="난수 시드의 의미">
  <rect x="40" y="40" width="560" height="280" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="320" y="85" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--ok)">new Random(42)</text>
  <text x="320" y="120" text-anchor="middle" style="font-size:19px;fill:var(--muted)">시드(seed) = 수열의 출발점</text>
  <g style="${MONO};font-size:22px;fill:var(--fg)">
    <text x="70" y="175">1회 실행:</text><text x="230" y="175">A  B  C  D  E …</text>
    <text x="70" y="220">2회 실행:</text><text x="230" y="220">A  B  C  D  E …</text>
    <text x="70" y="265">친구 PC :</text><text x="230" y="265">A  B  C  D  E …</text>
  </g>
  <text x="320" y="305" text-anchor="middle" style="font-size:19px;fill:var(--ok)">언제나 같은 수열 → 재현 · 테스트 · 디버깅 가능</text>
  <rect x="680" y="40" width="560" height="280" rx="14" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="960" y="85" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--warn)">new Random()</text>
  <text x="960" y="120" text-anchor="middle" style="font-size:19px;fill:var(--muted)">시드 없음 = 실행할 때마다 다른 출발점</text>
  <g style="${MONO};font-size:22px;fill:var(--fg)">
    <text x="710" y="175">1회 실행:</text><text x="870" y="175">A  B  C  D  E …</text>
    <text x="710" y="220">2회 실행:</text><text x="870" y="220">P  Q  R  S  T …</text>
    <text x="710" y="265">3회 실행:</text><text x="870" y="265">K  X  M  B  W …</text>
  </g>
  <text x="960" y="305" text-anchor="middle" style="font-size:19px;fill:var(--warn)">매번 다른 게임 — 실제 출시용 (하지만 버그 재현은 어렵다)</text>
</svg>`;

  /* ---------- 완성 프로그램 ---------- */
  const FINAL_CODE = `// ===== File: Enums.cs =====
using System;

${CS_ENUMS}

// ===== File: Screen.cs =====
using System;

${CS_SCREEN}

// ===== File: Character.cs =====
using System;

${CS_CHARACTER}

// ===== File: Hero.cs =====
using System;
using System.Collections.Generic;
using System.Linq;

${CS_HERO}

// ===== File: Monsters.cs =====
using System;

${CS_MONSTERS}

// ===== File: Battle.cs =====
using System;

${CS_BATTLE}

// ===== File: Game.cs =====
using System;
using System.Collections.Generic;
using System.IO;

${CS_GAME}

// ===== File: Program.cs =====
using System;

class Program
{
    static void Main()
    {
        Screen.Say("=== 던전 탐험: 드래곤의 둥지 ===", ConsoleColor.Cyan);
        Console.Write("1.새 게임 2.불러오기 > ");
        string choice = (Console.ReadLine() ?? "1").Trim();
        var rng = new Random(42);                  // 고정 시드 — 같은 선택이면 언제나 같은 모험

        Game? game = null;
        if (choice == "2" && !Game.TryLoad(Game.SaveFile, rng, out game))
            Console.WriteLine("저장된 게임이 없어 새로 시작합니다.");
        if (game == null)
        {
            Console.Write("용사의 이름: ");
            string name = (Console.ReadLine() ?? "").Trim();
            game = new Game(new Hero(name == "" ? "용사" : name), rng);
        }

        GameState result = game.Run();
        Console.WriteLine();
        switch (result)
        {
            case GameState.Victory: Screen.Say("★ 드래곤을 물리쳤다! 던전 정복! ★", ConsoleColor.Yellow); break;
            case GameState.GameOver: Screen.Say("GAME OVER", ConsoleColor.Red); break;
            default: Console.WriteLine("모험을 멈추었습니다."); break;
        }
        game.PrintSummary();
    }
}`;

  const FINAL_STDIN = [
    '1', '아린', '2',                 // 새 게임, 이름, 상태 보기
    '1', '1', '1', '1',               // 방 1: 고블린과 전투 (공격 3번)
    '1', '4',                         // 방 2: 보물 상자, 저장
    '1', '1', '1',                    // 방 3: 슬라임 (공격 2번)
    '1',                              // 방 4: 샘물
    '1', '1', '1', '1',               // 방 5: 고블린 (공격 3번)
    '1',                              // 방 6: 보스
    '3', '2', '3', '2', '2', '1',     // 폭탄, 폭탄, 3턴 브레스에 방어, 공격
    '3', '1', '2', '1', '1'           // 포션, 6턴 브레스에 방어, 공격, 공격
  ].join('\n') + '\n';

  const FINAL_EXPECT = "=== 던전 탐험: 드래곤의 둥지 ===\n1.새 게임 2.불러오기 > 용사의 이름:\n[방 1/6] 아린 Lv.1 [##########] 60/60 골드 0\n1.앞으로 2.상태 3.아이템 4.저장 0.포기 > 아린 Lv.1  경험치 0/20  공격 12  방어 3\n가방: 포션 x2, 폭탄 x1, 엘릭서 x0  골드 0\n\n[방 1/6] 아린 Lv.1 [##########] 60/60 골드 0\n1.앞으로 2.상태 3.아이템 4.저장 0.포기 > 고블린(이)가 나타났다!\n--- 1턴 ---  아린 [##########] 60/60  |  고블린 [##########] 32/32\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 치명타! 고블린에게 18의 피해.\n고블린의 공격! 아린에게 5의 피해!\n--- 2턴 ---  아린 [#########.] 55/60  |  고블린 [####......] 14/32\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 고블린에게 9의 피해.\n고블린의 공격! 아린에게 5의 피해!\n--- 3턴 ---  아린 [########..] 50/60  |  고블린 [#.........] 5/32\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 고블린에게 11의 피해.\n고블린을(를) 쓰러뜨렸다! 경험치 +14, 골드 +12\n\n[방 2/6] 아린 Lv.1 [########..] 50/60 골드 12\n1.앞으로 2.상태 3.아이템 4.저장 0.포기 > 보물 상자! 골드 15 와 폭탄 1개를 얻었다.\n\n[방 3/6] 아린 Lv.1 [########..] 50/60 골드 27\n1.앞으로 2.상태 3.아이템 4.저장 0.포기 > save.txt 에 저장했습니다.\n\n[방 3/6] 아린 Lv.1 [########..] 50/60 골드 27\n1.앞으로 2.상태 3.아이템 4.저장 0.포기 > 슬라임(이)가 나타났다!\n--- 1턴 ---  아린 [########..] 50/60  |  슬라임 [##########] 20/20\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 슬라임에게 11의 피해.\n슬라임의 공격! 아린에게 4의 피해!\n--- 2턴 ---  아린 [#######...] 46/60  |  슬라임 [####......] 9/20\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 슬라임에게 10의 피해.\n슬라임을(를) 쓰러뜨렸다! 경험치 +8, 골드 +5\n레벨 업! Lv.2 (HP 70, 공격 15, 방어 4)\n\n[방 4/6] 아린 Lv.2 [##########] 70/70 골드 32\n1.앞으로 2.상태 3.아이템 4.저장 0.포기 > 신비한 샘물을 마셨다. HP +0\n\n[방 5/6] 아린 Lv.2 [##########] 70/70 골드 32\n1.앞으로 2.상태 3.아이템 4.저장 0.포기 > 고블린(이)가 나타났다!\n--- 1턴 ---  아린 [##########] 70/70  |  고블린 [##########] 32/32\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 고블린에게 12의 피해.\n고블린이 단검을 두 번 휘둘렀다! 아린에게 12의 피해!\n--- 2턴 ---  아린 [########..] 58/70  |  고블린 [######....] 20/32\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 고블린에게 14의 피해.\n고블린의 공격! 아린에게 4의 피해!\n--- 3턴 ---  아린 [#######...] 54/70  |  고블린 [#.........] 6/32\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 치명타! 고블린에게 30의 피해.\n고블린을(를) 쓰러뜨렸다! 경험치 +14, 골드 +12\n\n[방 6/6] 아린 Lv.2 [#######...] 54/70 골드 44\n1.앞으로 2.상태 3.아이템 4.저장 0.포기 > 거대한 문이 열린다... 던전의 주인이 깨어났다!\n드래곤(이)가 나타났다!\n--- 1턴 ---  아린 [#######...] 54/70  |  드래곤 [##########] 80/80\n1.공격 2.방어 3.아이템 4.도망 > 가방: 포션 x2, 폭탄 x2, 엘릭서 x0 | 번호(1.포션 2.폭탄 3.엘릭서, 0.취소) > 폭탄을 던졌다! 드래곤에게 25의 피해.\n드래곤의 공격! 아린에게 11의 피해!\n--- 2턴 ---  아린 [######....] 43/70  |  드래곤 [######....] 55/80\n1.공격 2.방어 3.아이템 4.도망 > 가방: 포션 x2, 폭탄 x1, 엘릭서 x0 | 번호(1.포션 2.폭탄 3.엘릭서, 0.취소) > 폭탄을 던졌다! 드래곤에게 25의 피해.\n드래곤의 공격! 아린에게 10의 피해!\n--- 3턴 ---  아린 [####......] 33/70  |  드래곤 [###.......] 30/80\n1.공격 2.방어 3.아이템 4.도망 > 아린은(는) 방패를 들었다. (받는 피해 절반)\n드래곤이 불꽃 브레스를 뿜었다!! 아린에게 9의 피해!\n--- 4턴 ---  아린 [###.......] 24/70  |  드래곤 [###.......] 30/80\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 드래곤에게 11의 피해.\n드래곤의 공격! 아린에게 7의 피해!\n--- 5턴 ---  아린 [##........] 17/70  |  드래곤 [##........] 19/80\n1.공격 2.방어 3.아이템 4.도망 > 가방: 포션 x2, 폭탄 x0, 엘릭서 x0 | 번호(1.포션 2.폭탄 3.엘릭서, 0.취소) > 포션을 마셨다. HP +30\n드래곤의 공격! 아린에게 8의 피해!\n--- 6턴 ---  아린 [#####.....] 39/70  |  드래곤 [##........] 19/80\n1.공격 2.방어 3.아이템 4.도망 > 아린은(는) 방패를 들었다. (받는 피해 절반)\n드래곤이 불꽃 브레스를 뿜었다!! 아린에게 9의 피해!\n--- 7턴 ---  아린 [####......] 30/70  |  드래곤 [##........] 19/80\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 드래곤에게 11의 피해.\n드래곤의 공격! 아린에게 7의 피해!\n--- 8턴 ---  아린 [###.......] 23/70  |  드래곤 [#.........] 8/80\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 드래곤에게 11의 피해.\n드래곤을(를) 쓰러뜨렸다! 경험치 +100, 골드 +100\n레벨 업! Lv.4 (HP 90, 공격 21, 방어 6)\n\n★ 드래곤을 물리쳤다! 던전 정복! ★\n아린: Lv.4, HP 90/90, 골드 144, 도달한 방 6/6";
  const PREVIEW = "[방 6/6] 아린 Lv.2 [#######...] 54/70 골드 44\n...\n--- 3턴 ---  아린 [####......] 33/70  |  드래곤 [###.......] 30/80\n1.공격 2.방어 3.아이템 4.도망 > 아린은(는) 방패를 들었다. (받는 피해 절반)\n드래곤이 불꽃 브레스를 뿜었다!! 아린에게 9의 피해!\n--- 4턴 ---  아린 [###.......] 24/70  |  드래곤 [###.......] 30/80\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 드래곤에게 11의 피해.\n드래곤의 공격! 아린에게 7의 피해!\n--- 5턴 ---  아린 [##........] 17/70  |  드래곤 [##........] 19/80\n1.공격 2.방어 3.아이템 4.도망 > 가방: 포션 x2, 폭탄 x0, 엘릭서 x0 | 번호(1.포션 2.폭탄 3.엘릭서, 0.취소) > 포션을 마셨다. HP +30\n드래곤의 공격! 아린에게 8의 피해!\n--- 6턴 ---  아린 [#####.....] 39/70  |  드래곤 [##........] 19/80\n1.공격 2.방어 3.아이템 4.도망 > 아린은(는) 방패를 들었다. (받는 피해 절반)\n드래곤이 불꽃 브레스를 뿜었다!! 아린에게 9의 피해!\n--- 7턴 ---  아린 [####......] 30/70  |  드래곤 [##........] 19/80\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 드래곤에게 11의 피해.\n드래곤의 공격! 아린에게 7의 피해!\n--- 8턴 ---  아린 [###.......] 23/70  |  드래곤 [#.........] 8/80\n1.공격 2.방어 3.아이템 4.도망 > 아린의 공격! 드래곤에게 11의 피해.\n드래곤을(를) 쓰러뜨렸다! 경험치 +100, 골드 +100\n레벨 업! Lv.4 (HP 90, 공격 21, 방어 6)\n\n★ 드래곤을 물리쳤다! 던전 정복! ★\n아린: Lv.4, HP 90/90, 골드 144, 도달한 방 6/6";

  CS_COURSE.addChapter({
    id: 'p03',
    no: 'P03',
    title: '콘솔 텍스트 게임',
    subtitle: 'Project · Console Text RPG',
    summary: '상속과 다형성으로 용사 · 몬스터를 만들고, 고정 시드 Random(42) 로 “언제나 같은” 턴제 전투를, enum 으로 게임 상태 · 아이템 · 방 종류를, Dictionary 로 가방을, Console 색으로 화면을 꾸미는 던전 탐험 RPG 를 단계별로 완성합니다. 마지막에는 게임을 파일로 저장하고 불러옵니다.',
    goals: [
      '게임 규칙을 기획서(요구사항)로 정리하고 클래스 · enum · 상태 전이로 설계할 수 있다',
      'Random 에 시드를 주어 결과를 재현할 수 있게 만들고, 확률 규칙(치명타 · 도망)을 구현할 수 있다',
      '추상 클래스 Character 를 상속한 Hero · Monster 를 만들고, virtual/override 로 몬스터마다 다른 행동을 구현할 수 있다',
      'Console.ReadLine 선택으로 진행하는 턴제 전투 반복과 게임 상태 기계(enum GameState)를 작성할 수 있다',
      'Dictionary<ItemType, int> 로 인벤토리를 관리하고 enum 과 정수 · 문자열을 변환할 수 있다',
      'Console.ForegroundColor 로 출력을 꾸미고, 게임 상태를 key=value 파일로 저장 · 불러올 수 있다'
    ],
    requires: ['ch07', 'ch08', 'ch09', 'ch12'],
    preview: PREVIEW,
    sections: [
      /* =========================================================== 1교시 */
      {
        id: 'p03-1',
        title: '요구사항 분석과 설계',
        minutes: 50,
        goals: [
          '텍스트 RPG 의 규칙을 기획서(요구사항 표)로 정리할 수 있다',
          '캐릭터 계층 · enum · 게임 상태 전이를 설계할 수 있다',
          '고정 시드 Random 으로 재현 가능한 난수를 만들고 확률 규칙을 구현할 수 있다',
          'Console.ForegroundColor 와 enum 기본 사용법을 익힌다'
        ],
        flow: [['도입 · 완성품 시연', 5], ['게임 기획서', 10], ['클래스 · 상태 설계', 10], ['Random · 색 · enum 워밍업', 17], ['정리 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '무엇을 만들까? — 던전 탐험 RPG' },
          { type: 'p', html: '세 번째 프로젝트는 <b>콘솔 텍스트 게임</b>입니다. 용사가 여섯 개의 방으로 된 던전을 지나며 몬스터와 턴제로 싸우고, 보물과 샘물을 만나고, 마지막 방의 드래곤을 물리치면 승리합니다. 그림 대신 글자로 진행하지만, 게임에 필요한 거의 모든 프로그래밍 요소 — <b>상속 · 다형성 · 난수 · 열거형 · 상태 관리 · 컬렉션 · 파일</b> — 이 들어 있습니다.' },
          { type: 'p', html: '<pre><code>' + PREVIEW + '</code></pre>' },
          { type: 'h', text: '게임 기획서 (요구사항)' },
          { type: 'table', caption: '게임 규칙', head: ['항목', '규칙'], rows: [
            ['용사', 'HP 60 · 공격 12 · 방어 3 으로 시작. 가방에 포션 2 · 폭탄 1'],
            ['피해', '받는 피해 = 공격력 − 방어력 (최소 1). 용사 공격력은 매번 −2 ~ +2 흔들린다'],
            ['치명타', '용사의 공격은 15% 확률로 치명타 (공격력 2배)'],
            ['방어', '방어를 고른 턴에는 받는 공격력이 절반'],
            ['아이템', '포션 HP +30 · 엘릭서 HP 가득 · 폭탄 적에게 25 (방어 무시)'],
            ['도망', '50% 확률로 성공. 실패하면 그 턴을 잃는다. 도망친 방은 다시 도전'],
            ['몬스터', '슬라임(약함), 고블린(30% 연속 베기), 드래곤(보스, 3턴마다 불꽃 브레스)'],
            ['성장', '경험치가 레벨 × 20 이 되면 레벨 업: HP +10, 공격 +3, 방어 +1, HP 가득'],
            ['던전', '몬스터 → 보물 → 몬스터 → 샘물(HP 절반 회복) → 몬스터 → 보스'],
            ['저장', '탐험 중 저장하면 <code>save.txt</code> 에 기록, 시작 화면에서 불러오기']
          ] },
          { type: 'table', caption: '비기능 요구사항', head: ['항목', '규칙'], rows: [
            ['재현성', '<b>같은 선택을 하면 언제나 같은 결과</b> — 난수는 고정 시드 <code>new Random(42)</code>'],
            ['안정성', '잘못된 입력 · 입력 끝(EOF)에도 멈추거나 무한 반복하지 않는다'],
            ['화면', '피해는 빨강, 회복은 초록, 치명타 · 보물은 노랑 — 콘솔 색으로 구분'],
            ['확장성', '새 몬스터 · 새 방 종류를 기존 코드 수정 없이(또는 최소로) 추가할 수 있다']
          ] },
          { type: 'callout', kind: 'tip', title: '왜 “재현성” 이 요구사항일까?', html: '게임에서 버그가 났다는 제보를 받았을 때 <b>같은 상황을 다시 만들 수 없다면</b> 고칠 수도, 고쳤는지 확인할 수도 없습니다. 시드를 고정하면 “이 순서로 입력하면 3번째 방에서 HP 가 음수가 된다” 같은 버그를 언제든 다시 볼 수 있습니다. 이 강좌의 자동 검증도 같은 원리로 게임 출력을 비교합니다. 실제 출시할 때는 시드만 바꾸면(또는 빼면) 됩니다.' },
          { type: 'h', text: '클래스 · enum 설계' },
          { type: 'figure', html: SVG_CLASS, caption: '클래스 설계 — Character 를 상속한 Hero 와 Monster, Monster 를 상속한 세 몬스터, 상태 · 아이템 · 방을 나타내는 enum' },
          { type: 'list', items: [
            '<b><code>Character</code></b>(추상) — 이름 · HP · 공격 · 방어, 피해 받기 · 회복 · HP 막대. 용사와 몬스터의 공통',
            '<b><code>Hero</code></b> — 레벨 · 경험치 · 골드 · 가방(<code>Dictionary&lt;ItemType, int&gt;</code>). 방어 중이면 피해 절반(<code>TakeDamage</code> 재정의)',
            '<b><code>Monster</code></b> — 보상(경험치 · 골드)과 <code>virtual ChooseAttack</code>. 몬스터 종류마다 재정의해 다르게 행동',
            '<b>enum</b> — <code>GameState</code>(탐험 중 · 승리 · 패배 · 포기), <code>ItemType</code>, <code>RoomType</code>, <code>BattleResult</code>',
            '<b><code>Battle</code> · <code>Game</code> · <code>Screen</code></b> — 전투 진행, 던전 진행(상태 기계), 색 출력'
          ] },
          { type: 'figure', html: SVG_STATE, caption: '게임 상태 전이 — Exploring 에서 시작해 Victory · GameOver · Quit 중 하나로 끝난다' },
          { type: 'h', text: '워밍업 ① — 고정 시드 난수' },
          { type: 'p', html: '<code>Random</code> 은 사실 “진짜 무작위” 가 아니라 <b>시드(seed)</b>라는 출발값에서 정해진 계산으로 수를 만들어 내는 <b>의사 난수(pseudo-random)</b>입니다. 그래서 같은 시드로 만든 <code>Random</code> 은 언제나 <b>똑같은 수열</b>을 냅니다. <code>rng.Next(a, b)</code> 는 a 이상 <b>b 미만</b>의 정수입니다.' },
          { type: 'figure', html: SVG_SEED, caption: '시드를 주면 몇 번을 실행해도, 누구의 컴퓨터에서도 같은 수열이 나온다' },
          { type: 'code', title: '예제 P3-1. 같은 시드 = 같은 수열 · 확률 규칙 만들기', code: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        var a = new Random(42);
        var b = new Random(42);
        Console.WriteLine("a 주사위: " + string.Join(" ", Enumerable.Range(0, 8).Select(_ => a.Next(1, 7))));
        Console.WriteLine("b 주사위: " + string.Join(" ", Enumerable.Range(0, 8).Select(_ => b.Next(1, 7))));

        var rng = new Random(42);
        int critical = 0;
        for (int i = 0; i < 1000; i++)
            if (rng.Next(100) < 15) critical++;         // 0~99 중 15개(0~14) → 15%
        Console.WriteLine($"1000번 공격 중 치명타 {critical}번 (약 15%)");

        Console.Write("공격력 흔들림 Next(-2, 3): ");
        for (int i = 0; i < 10; i++)
            Console.Write($"{rng.Next(-2, 3)} ");      // -2, -1, 0, 1, 2 중 하나
        Console.WriteLine();
    }
}`, expect: `a 주사위: 5 1 1 4 2 2 5 4
b 주사위: 5 1 1 4 2 2 5 4
1000번 공격 중 치명타 171번 (약 15%)
공격력 흔들림 Next(-2, 3): 2 -1 -1 -2 -1 1 2 1 0 2`, desc: '<code>a</code> 와 <code>b</code> 는 서로 다른 객체지만 시드가 같아서 같은 주사위 수열이 나옵니다. <b>“p% 확률”</b> 은 <code>rng.Next(100) &lt; p</code> 로 만듭니다 — 0~99 의 100가지 중 p 가지가 참이기 때문입니다. 1000번 해 보면 150 근처가 나옵니다. <code>Next(-2, 3)</code> 에서 3 은 <b>포함되지 않는</b> 것에 주의하세요.' },
          { type: 'code', title: '추가 예제. 시드 없는 Random — 실행할 때마다 다르다', nondeterministic: true, code: `using System;

class Program
{
    static void Main()
    {
        var rng = new Random();                       // 시드 없음
        Console.Write("오늘의 주사위: ");
        for (int i = 0; i < 5; i++)
            Console.Write($"{rng.Next(1, 7)} ");
        Console.WriteLine();
        Console.WriteLine("다시 실행해 보세요 — 다른 수가 나옵니다.");
    }
}`, desc: '실행 버튼을 여러 번 눌러 보세요. 시드가 없으면 실행할 때마다 다른 수열이 나오므로 자동 검증에서는 “정답 출력” 을 정할 수 없습니다(<code>nondeterministic</code>). 이 프로젝트의 게임은 모두 <code>new Random(42)</code> 를 씁니다.' },
          { type: 'callout', kind: 'warn', title: '흔한 실수: 반복문 안에서 new Random()', html: '<code>for (…) { var r = new Random(); … r.Next(…) }</code> 처럼 매번 새로 만들면 느리고, 오래된 .NET 에서는 같은 수가 연속으로 나오기도 했습니다. <code>Random</code> 은 <b>프로그램에서 하나만</b> 만들어 필요한 곳에 넘겨 쓰세요. 이 게임도 <code>Main</code> 에서 만든 <code>rng</code> 하나를 <code>Game</code> · <code>Battle</code> · 몬스터가 함께 씁니다.' },
          { type: 'h', text: '워밍업 ② — 콘솔 색으로 꾸미기' },
          { type: 'p', html: '<code>Console.ForegroundColor = ConsoleColor.Red;</code> 로 글자색을 바꾸면 그 뒤의 모든 출력이 그 색이 됩니다. 다 쓰고 나면 <code>Console.ResetColor()</code> 로 되돌려야 합니다. “색 바꾸기 → 출력 → 되돌리기” 를 매번 쓰는 대신 메서드 <code>Say</code> 하나로 묶어 둡니다.' },
          { type: 'code', title: '예제 P3-2. 색 출력 메서드 Say 와 HP 막대', code: `using System;

${CS_SCREEN}

class Program
{
    static string HpBar(int hp, int maxHp)
    {
        int filled = hp * 10 / maxHp;
        return $"[{new string('#', filled)}{new string('.', 10 - filled)}] {hp}/{maxHp}";
    }

    static void Main()
    {
        Screen.Say("=== 던전 탐험 ===", ConsoleColor.Cyan);
        Screen.Say("슬라임의 공격! 아린에게 5의 피해!", ConsoleColor.Red);
        Screen.Say("포션을 마셨다. HP +30", ConsoleColor.Green);
        Screen.Say("치명타!", ConsoleColor.Yellow);
        Console.WriteLine("색이 원래대로 돌아왔다.");

        int[] hps = { 60, 42, 17, 3, 0 };
        foreach (int hp in hps)
        {
            ConsoleColor color = (hp * 100 / 60) switch      // 남은 비율(%)에 따라 색 결정
            {
                >= 50 => ConsoleColor.Green,
                >= 20 => ConsoleColor.Yellow,
                _ => ConsoleColor.Red
            };
            Screen.Say(HpBar(hp, 60), color);
        }
    }
}`, expect: `=== 던전 탐험 ===
슬라임의 공격! 아린에게 5의 피해!
포션을 마셨다. HP +30
치명타!
색이 원래대로 돌아왔다.
[##########] 60/60
[#######...] 42/60
[##........] 17/60
[..........] 3/60
[..........] 0/60`, desc: '이 강좌의 웹 콘솔은 색을 그대로 보여 줍니다(검증 결과에는 글자만 비교됩니다). <code>hp * 10 / maxHp</code> 는 정수 나눗셈이라 막대 칸 수가 정수로 떨어집니다. <code>(hp * 100 / 60) switch { … }</code> 는 12장의 switch 식 + 관계 패턴입니다. switch 식은 곱셈 · 나눗셈보다 <b>우선순위가 높아서</b> 괄호가 없으면 <code>60 switch { … }</code> 로 해석되어 컴파일 오류가 납니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 콘솔 창 꾸미기', html: 'Visual Studio 로 실행하면 <b>Windows 터미널/콘솔 창</b>에 색이 그대로 나옵니다. <code>Console.Title = "던전 탐험";</code> 으로 창 제목을, <code>Console.OutputEncoding = System.Text.Encoding.UTF8;</code> 로 ★ 같은 특수 문자가 깨지지 않게 할 수 있습니다. 창이 바로 닫히면 <b>도구 → 옵션 → 디버깅 → “디버깅이 중지되면 자동으로 콘솔 닫기”</b> 체크를 끄세요.' },
          { type: 'h', text: '워밍업 ③ — enum 으로 상태와 아이템 표현하기' },
          { type: 'p', html: '게임 상태를 <code>int state = 0; // 0: 탐험, 1: 승리 …</code> 처럼 숫자로 두면 “2 가 뭐였지?” 를 매번 떠올려야 하고, 7 같은 엉뚱한 값도 들어갈 수 있습니다. 12장의 <b>열거형(enum)</b>은 이름 붙은 상수의 집합입니다. 속으로는 정수(0, 1, 2 …)라서 정수로 바꾸거나, 문자열로 출력하거나, <code>Dictionary</code> 의 키로 쓸 수 있습니다.' },
          { type: 'code', title: '예제 P3-3. enum — 상태 · 아이템 · 정수와 문자열 변환', code: `using System;
using System.Collections.Generic;

enum GameState { Exploring, Victory, GameOver, Quit }
enum ItemType { Potion, Bomb, Elixir }

class Program
{
    static string Describe(GameState s) => s switch
    {
        GameState.Exploring => "탐험 중",
        GameState.Victory => "승리!",
        GameState.GameOver => "패배...",
        _ => "포기"
    };

    static void Main()
    {
        GameState state = GameState.Exploring;
        Console.WriteLine($"{state} = {(int)state} → {Describe(state)}");
        state = GameState.Victory;
        Console.WriteLine($"{state} = {(int)state} → {Describe(state)}");

        ItemType item = (ItemType)2;                         // 정수 → enum
        Console.WriteLine($"2번 아이템: {item}");
        Console.WriteLine($"5 는 ItemType 인가? {Enum.IsDefined(typeof(ItemType), 5)}");

        bool ok = Enum.TryParse("Bomb", out ItemType parsed);   // 문자열 → enum (파일 불러오기에 사용)
        Console.WriteLine($"\\"Bomb\\" → {ok}, {parsed}");

        var bag = new Dictionary<ItemType, int> { [ItemType.Potion] = 2, [ItemType.Bomb] = 1 };
        foreach (ItemType t in Enum.GetValues<ItemType>())      // 모든 값 돌기
            Console.WriteLine($"  {t,-7} x{bag.GetValueOrDefault(t)}");
    }
}`, expect: `Exploring = 0 → 탐험 중
Victory = 1 → 승리!
2번 아이템: Elixir
5 는 ItemType 인가? False
"Bomb" → True, Bomb
  Potion  x2
  Bomb    x1
  Elixir  x0`, desc: 'enum 값을 <code>{state}</code> 로 출력하면 <b>이름</b>이, <code>(int)state</code> 로 바꾸면 <b>번호</b>가 나옵니다. <code>Enum.IsDefined</code> 는 정수가 올바른 enum 값인지 검사합니다(사용자가 고른 번호를 enum 으로 바꾸기 전에). <code>GetValueOrDefault</code> 는 키가 없으면 0 을 돌려줍니다(Elixir).' },
          { type: 'h', text: '구현 계획' },
          { type: 'figure', html: SVG_MAP, caption: '던전 지도 — 여섯 개의 방. 몬스터 종류와 보물은 고정 시드 난수가 정한다' },
          { type: 'table', head: ['교시', '단계', '내용'], rows: [
            ['2', '1 · 2 · 3', 'Character · Hero · Monster 상속 → 턴제 전투 반복 → 몬스터마다 다른 행동(다형성)'],
            ['3', '4 · 5 · 6', '가방(Dictionary) · 아이템 → 경험치 · 레벨 업 → 던전 탐험 상태 기계'],
            ['4', '7 · 완성', '저장 · 불러오기 → 파일 분리 완성본 → 테스트 · 밸런스 · 확장 과제']
          ] }
        ],
        practice: [
          {
            title: '실습 P3-1. 주사위 두 개의 합 분포',
            level: 1,
            desc: '<p><code>new Random(42)</code> 로 주사위 두 개를 600번 굴려 합(2~12)이 나온 횟수를 세고, 5번마다 <code>*</code> 하나로 막대그래프를 그리세요. 마지막에 가장 많이 나온 합을 출력합니다.</p><pre><code> 2:  24 ****\n 3:  28 *****\n …</code></pre>',
            hint: '<code>int[] counts = new int[13];</code> 에 <code>counts[rng.Next(1, 7) + rng.Next(1, 7)]++</code>. 가장 많이 나온 합: <code>Array.IndexOf(counts, counts.Max())</code>',
            starter: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        var rng = new Random(42);
        int[] counts = new int[13];          // 인덱스 = 합 (0, 1 은 쓰지 않음)
        // TODO: 600번 굴려 counts 채우기
        // TODO: 2~12 막대그래프 출력, 가장 많이 나온 합 출력
        Console.WriteLine($"배열 길이 {counts.Length}, 첫 주사위 {rng.Next(1, 7)}");
    }
}
`,
            solution: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        var rng = new Random(42);
        int[] counts = new int[13];
        for (int i = 0; i < 600; i++)
            counts[rng.Next(1, 7) + rng.Next(1, 7)]++;
        for (int sum = 2; sum <= 12; sum++)
            Console.WriteLine($"{sum,2}: {counts[sum],3} {new string('*', counts[sum] / 5)}");
        Console.WriteLine($"가장 많이 나온 합: {Array.IndexOf(counts, counts.Max())}");
    }
}`,
            expect: ` 2:  24 ****
 3:  28 *****
 4:  54 **********
 5:  66 *************
 6:  94 ******************
 7:  86 *****************
 8:  81 ****************
 9:  74 **************
10:  49 *********
11:  29 *****
12:  15 ***
가장 많이 나온 합: 6`
          },
          {
            title: '실습 P3-2. enum Direction 으로 지도 이동',
            level: 2,
            desc: '<p><code>enum Direction { North, East, South, West }</code> 를 만들고, 한 줄에 하나씩 <code>n/e/s/w</code> 를 입력받아 5×5 지도(0~4)에서 (2, 2) 부터 이동하세요. 지도 밖이면 <code>North 쪽은 벽이다!</code>, 모르는 글자면 <code>알 수 없는 방향: q</code>, 빈 줄이면 끝내고 최종 위치와 이동 횟수를 출력합니다.</p>',
            hint: '<code>static bool TryParseDirection(string s, out Direction d)</code> 를 switch 로 만들고, 이동량은 <code>(int dx, int dy) = d switch { Direction.North =&gt; (0, -1), … }</code> 튜플로.',
            starter: `using System;

enum Direction { North, East, South, West }

class Program
{
    static bool TryParseDirection(string s, out Direction d)
    {
        // TODO: "n" → North, "e" → East, "s" → South, "w" → West
        d = Direction.North;
        return false;
    }

    static void Main()
    {
        int x = 2, y = 2, moves = 0;
        while (true)
        {
            Console.Write("명령(n/e/s/w): ");
            string line = (Console.ReadLine() ?? "").Trim();
            if (line == "") break;
            if (!TryParseDirection(line, out Direction d)) { Console.WriteLine($"알 수 없는 방향: {line}"); continue; }
            // TODO: d 에 따라 이동 (벽이면 안내), moves 증가
            Console.WriteLine(d);
        }
        Console.WriteLine($"최종 위치 ({x}, {y}), 이동 {moves}번");
    }
}
`,
            solution: `using System;

enum Direction { North, East, South, West }

class Program
{
    static bool TryParseDirection(string s, out Direction d)
    {
        switch (s.ToLower())
        {
            case "n": d = Direction.North; return true;
            case "e": d = Direction.East; return true;
            case "s": d = Direction.South; return true;
            case "w": d = Direction.West; return true;
            default: d = default; return false;
        }
    }

    static void Main()
    {
        int x = 2, y = 2, moves = 0;
        while (true)
        {
            Console.Write("명령(n/e/s/w): ");
            string line = (Console.ReadLine() ?? "").Trim();
            if (line == "") break;
            if (!TryParseDirection(line, out Direction d)) { Console.WriteLine($"알 수 없는 방향: {line}"); continue; }
            (int dx, int dy) = d switch
            {
                Direction.North => (0, -1),
                Direction.East => (1, 0),
                Direction.South => (0, 1),
                _ => (-1, 0)
            };
            int nx = x + dx, ny = y + dy;
            if (nx < 0 || nx > 4 || ny < 0 || ny > 4) { Console.WriteLine($"{d} 쪽은 벽이다!"); continue; }
            x = nx; y = ny; moves++;
            Console.WriteLine($"{d} 로 이동 → ({x}, {y})");
        }
        Console.WriteLine($"최종 위치 ({x}, {y}), 이동 {moves}번");
    }
}`,
            stdin: 'n\nn\nn\ne\nq\ns\nw\nw\nw\n\n',
            expect: `명령(n/e/s/w): North 로 이동 → (2, 1)
명령(n/e/s/w): North 로 이동 → (2, 0)
명령(n/e/s/w): North 쪽은 벽이다!
명령(n/e/s/w): East 로 이동 → (3, 0)
명령(n/e/s/w): 알 수 없는 방향: q
명령(n/e/s/w): South 로 이동 → (3, 1)
명령(n/e/s/w): West 로 이동 → (2, 1)
명령(n/e/s/w): West 로 이동 → (1, 1)
명령(n/e/s/w): West 로 이동 → (0, 1)
명령(n/e/s/w): 최종 위치 (0, 1), 이동 7번`
          }
        ],
        quiz: [
          { q: '<code>var a = new Random(42); var b = new Random(42);</code> 일 때 <code>a.Next(100)</code> 과 <code>b.Next(100)</code> 의 관계는?', options: ['항상 다르다', '항상 같다', '가끔 같다', 'b 는 예외가 난다'], answer: 1, explain: '같은 시드로 만든 Random 은 같은 수열을 냅니다. 그래서 시드를 고정하면 게임을 재현할 수 있습니다.' },
          { q: '<code>rng.Next(-2, 3)</code> 이 돌려줄 수 <b>없는</b> 값은?', options: ['-2', '0', '2', '3'], answer: 3, explain: 'Next(min, max) 는 min 이상 max <b>미만</b>입니다. -2, -1, 0, 1, 2 중 하나.' },
          { q: '“20% 확률로 독 공격” 을 만드는 조건으로 알맞은 것은?', options: ['<code>rng.Next(100) &lt; 20</code>', '<code>rng.Next(100) == 20</code>', '<code>rng.Next(20) &lt; 100</code>', '<code>rng.Next(5) &gt; 1</code>'], answer: 0, explain: '0~99 의 100가지 중 0~19 의 20가지일 때 참 → 20%. <code>rng.Next(5) == 0</code> 도 20% 입니다.' },
          { q: '<code>enum ItemType { Potion, Bomb, Elixir }</code> 에서 <code>(ItemType)1</code> 과 <code>(int)ItemType.Elixir</code> 는?', options: ['Potion, 3', 'Bomb, 2', 'Bomb, 3', 'Elixir, 2'], answer: 1, explain: '값을 지정하지 않으면 0 부터 차례로 번호가 붙습니다: Potion=0, Bomb=1, Elixir=2.' },
          { q: '<code>Console.ForegroundColor = ConsoleColor.Red;</code> 뒤에 <code>Console.ResetColor()</code> 를 부르지 않으면?', options: ['그 줄만 빨강이다', '이후의 모든 출력이 계속 빨강이다', '컴파일 오류가 난다', '색이 적용되지 않는다'], answer: 1, explain: '글자색은 바꾼 뒤로 계속 유지됩니다. 그래서 Say 메서드처럼 “바꾸기 → 출력 → 되돌리기” 를 묶어 둡니다.' }
        ],
        slides: [
          { layout: 'title', title: '요구사항 분석과 설계', subtitle: 'Project 03 · 콘솔 텍스트 게임 — 1교시', badge: 'P03-1',
            notes: '<p><b>[도입 3분]</b> 4교시 완성 게임을 실행해 한 판 보여 줍니다(학생에게 입력을 맡기면 더 좋습니다). 드래곤의 브레스 턴에 방어를 고르는 장면을 꼭 보여 주세요.</p><p>발문: “이 게임을 만들려면 무엇이 필요할까요?” → 캐릭터, 몬스터 종류, 주사위(난수), 가방, 방 …</p>' },
          { layout: 'table', title: '게임 기획서 — 핵심 규칙', head: ['항목', '규칙'], rows: [['피해', '공격력 − 방어력 (최소 1)'], ['치명타', '15%, 공격력 2배'], ['방어', '받는 공격력 절반'], ['도망', '50%'], ['몬스터', '슬라임 · 고블린(연속 베기) · 드래곤(3턴마다 브레스)'], ['성장', '경험치 레벨×20 → 레벨 업']],
            lead: '숫자로 쓴 규칙 = 코드로 옮길 수 있는 규칙',
            notes: '<p><b>[5분]</b> “게임 기획자는 규칙을 숫자로 적는다.” 숫자가 있으면 밸런스를 조정할 수 있습니다(4교시). 발문: “치명타 확률을 50%로 하면 게임이 어떻게 될까?”</p>' },
          { layout: 'bullets', title: '비기능 요구사항', lead: '보이지 않지만 중요한 것',
            bullets: ['<b>재현성</b>: 같은 선택 → 같은 결과 (<code>new Random(42)</code>)', '<b>안정성</b>: 잘못된 입력 · 입력 끝에도 멈추지 않음', '<b>화면</b>: 피해 빨강 · 회복 초록 · 치명타 노랑', '<b>확장성</b>: 새 몬스터를 쉽게 추가'],
            notes: '<p><b>[3분]</b> 재현성이 왜 필요한지: 버그 제보 → 재현 → 수정 → 확인. 자동 검증도 이 덕분에 가능하다는 것을 알려 줍니다.</p>' },
          { layout: 'diagram', title: '클래스 · enum 설계', html: SVG_CLASS, caption: 'Character → Hero / Monster → Slime · Goblin · Dragon',
            notes: '<p><b>[5분]</b> P02 의 Account 계층과 비교: 공통은 부모(Character), 차이는 자식. Monster 의 ChooseAttack 이 virtual 인 이유 → 몬스터마다 행동이 다르니까.</p>' },
          { layout: 'diagram', title: '게임 상태 전이', html: SVG_STATE, caption: 'enum GameState 하나로 게임 흐름 관리',
            notes: '<p><b>[3분]</b> 상태 기계(state machine) 용어를 소개합니다. 신호등(빨강 → 초록 → 노랑)도 상태 기계입니다. 게임의 메인 반복문은 “상태가 Exploring 인 동안” 돕니다.</p>' },
          { layout: 'diagram', title: '시드의 의미', html: SVG_SEED, caption: '의사 난수 — 출발값이 같으면 수열도 같다',
            notes: '<p><b>[3분]</b> 비유: 시드 = 요리책의 페이지 번호. 같은 페이지를 펴면 같은 레시피.</p>' },
          { layout: 'code', title: '예제 P3-1. 고정 시드와 확률', code: `using System;

class Program
{
    static void Main()
    {
        var a = new Random(42);
        var b = new Random(42);
        for (int i = 0; i < 6; i++)
            Console.Write($"{a.Next(1, 7)}/{b.Next(1, 7)}  ");
        Console.WriteLine();

        var rng = new Random(42);
        int critical = 0;
        for (int i = 0; i < 1000; i++)
            if (rng.Next(100) < 15) critical++;     // 15% 확률
        Console.WriteLine($"치명타 {critical}/1000");
    }
}`, points: ['같은 시드 → 같은 수열', '<code>Next(a, b)</code>: a 이상 b 미만', 'p% 확률 = <code>Next(100) &lt; p</code>'],
            notes: '<p><b>[5분]</b> 실행을 여러 번 눌러도 같은 결과임을 확인합니다. 그다음 시드를 7 로 바꿔 보게 하세요 — 수열이 바뀌지만 여전히 매번 같습니다.</p>' },
          { layout: 'code', title: '예제 P3-2. 색 출력 Say', code: `using System;

class Program
{
    static void Say(string text, ConsoleColor color)
    {
        Console.ForegroundColor = color;
        Console.WriteLine(text);
        Console.ResetColor();                // 반드시 되돌린다
    }

    static void Main()
    {
        Say("슬라임의 공격! 5의 피해!", ConsoleColor.Red);
        Say("포션을 마셨다. HP +30", ConsoleColor.Green);
        Say("치명타!", ConsoleColor.Yellow);
        Console.WriteLine("원래 색");
    }
}`, points: ['<code>ForegroundColor</code>: 글자색', '<code>ResetColor()</code>: 원래대로', '세 줄을 메서드 하나로 묶기'],
            notes: '<p><b>[3분]</b> ResetColor 를 지우고 실행해 “원래 색” 줄까지 노랗게 나오는 것을 보여 줍니다. BackgroundColor 도 있다고 소개.</p>' },
          { layout: 'code', title: '예제 P3-3. enum 기본', code: `using System;
using System.Collections.Generic;

enum ItemType { Potion, Bomb, Elixir }

class Program
{
    static void Main()
    {
        ItemType item = ItemType.Bomb;
        Console.WriteLine($"{item} = {(int)item}");
        Console.WriteLine((ItemType)2);
        Console.WriteLine(Enum.IsDefined(typeof(ItemType), 5));
        Enum.TryParse("Potion", out ItemType p);
        Console.WriteLine(p);

        var bag = new Dictionary<ItemType, int> { [ItemType.Potion] = 2 };
        foreach (ItemType t in Enum.GetValues<ItemType>())
            Console.WriteLine($"{t}: {bag.GetValueOrDefault(t)}");
    }
}`, points: ['이름 ↔ 번호: <code>(int)</code> · <code>(ItemType)</code>', '<code>Enum.IsDefined</code> 로 번호 검사', '<code>Enum.TryParse</code>: 문자열 → enum', '<code>Enum.GetValues&lt;T&gt;()</code>'],
            notes: '<p><b>[5분]</b> “숫자 0, 1, 2 대신 이름을 쓰면 무엇이 좋을까?” → 읽기 쉽고, 잘못된 값을 컴파일러가 막아 준다. TryParse 는 4교시 저장 파일 불러오기에서 다시 씁니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '“30% 확률로 연속 베기” 를 만드는 코드는?', options: ['<code>rng.Next(100) &lt; 30</code>', '<code>rng.Next(30) == 0</code>', '<code>rng.Next(100) &gt; 30</code>', '<code>rng.Next(3) == 3</code>'], answer: 0, explain: '0~29 의 30가지 → 30%. <code>&gt; 30</code> 은 31~99 의 69% 입니다.',
            notes: '<p><b>[2분]</b> <code>rng.Next(3) == 3</code> 은 절대 참이 될 수 없다(0~2)는 것도 짚어 주세요.</p>' },
          { layout: 'practice', title: '실습 P3-1. 주사위 합 분포', desc: 'Random(42) 로 주사위 두 개를 600번 굴려 합의 빈도를 막대그래프로', starter: `using System;

class Program
{
    static void Main()
    {
        var rng = new Random(42);
        int[] counts = new int[13];
        // TODO: 600번 굴리기, 2~12 막대그래프
        Console.WriteLine(counts.Length);
    }
}`, solution: `using System;

class Program
{
    static void Main()
    {
        var rng = new Random(42);
        int[] counts = new int[13];
        for (int i = 0; i < 600; i++)
            counts[rng.Next(1, 7) + rng.Next(1, 7)]++;
        for (int sum = 2; sum <= 12; sum++)
            Console.WriteLine($"{sum,2}: {counts[sum],3} {new string('*', counts[sum] / 5)}");
    }
}`,
            notes: '<p><b>[실습 안내]</b> 이론상 7 이 가장 많아야 하는데(경우의 수 6가지) 시드 42 로 600번 굴리면 6 이 94번으로 7(86번)보다 많이 나옵니다. “횟수가 적으면 결과가 흔들린다” 는 것을 토론하고, 횟수를 60000 으로 늘려 비교해 보게 하세요. 빠른 학생은 P3-2(enum 이동).</p>' },
          { layout: 'summary', title: '정리', bullets: ['기획서: 규칙을 숫자로, 재현성은 요구사항', 'Character → Hero / Monster → 세 몬스터', '상태는 <code>enum GameState</code>', '<code>new Random(42)</code>: 같은 시드 = 같은 수열, 확률은 <code>Next(100) &lt; p</code>', '색: <code>ForegroundColor</code> + <code>ResetColor</code>'],
            notes: '<p>다음 시간: Character · Hero · Monster 를 만들고 첫 턴제 전투를 합니다.</p>' }
        ]
      },

      /* =========================================================== 2교시 */
      {
        id: 'p03-2',
        title: '단계별 구현 ① — 캐릭터와 턴제 전투',
        minutes: 50,
        goals: [
          '추상 클래스 Character 와 이를 상속한 Hero · Monster 를 만들고, 피해 · 회복 규칙을 메서드로 캡슐화할 수 있다',
          'Console.ReadLine 선택과 Random 으로 진행되는 턴제 전투 반복을 작성할 수 있다',
          'virtual 메서드를 몬스터마다 override 해 서로 다른 행동(다형성)을 구현하고, 튜플로 여러 값을 돌려줄 수 있다'
        ],
        flow: [['복습 · 목표', 3], ['단계 1: 캐릭터 상속', 12], ['단계 2: 턴제 전투', 15], ['단계 3: 몬스터별 행동', 10], ['실습 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '단계 1. Character — 용사와 몬스터의 공통 부모' },
          { type: 'p', html: '용사와 몬스터는 모두 이름 · HP · 공격력 · 방어력이 있고, 피해를 받고, 회복하고, HP 가 0 이 되면 쓰러집니다. 이 공통 부분을 추상 클래스 <code>Character</code> 에 모읍니다. HP 는 <code>protected set</code> 이라 밖에서 <code>hero.Hp = 9999</code> 같은 치트를 쓸 수 없고, 반드시 <code>TakeDamage</code> · <code>Heal</code> 을 거쳐 규칙(최소 피해 1, 최대 HP 초과 금지, 0 미만 금지)이 지켜집니다.' },
          { type: 'code', title: '단계 1. Character · Hero · Monster 상속', code: `using System;

${CS_CHARACTER}

class Hero : Character
{
    public bool Defending { get; set; }
    public Hero(string name) : base(name, 60, 12, 3) { }

    // 방어 중이면 받는 공격력이 절반 — 부모의 규칙에 한 가지를 더한다
    public override int TakeDamage(int power) => base.TakeDamage(Defending ? power / 2 : power);
}

class Monster : Character
{
    public Monster(string name, int hp, int attack, int defense) : base(name, hp, attack, defense) { }
}

class Program
{
    static void Main()
    {
        var hero = new Hero("아린");
        var slime = new Monster("슬라임", 20, 7, 0);
        Console.WriteLine($"{hero.Name,-4} {hero.HpBar()}  공격 {hero.Attack} 방어 {hero.Defense}");
        Console.WriteLine($"{slime.Name,-4} {slime.HpBar()}  공격 {slime.Attack} 방어 {slime.Defense}");

        int d1 = slime.TakeDamage(hero.Attack);            // 12 - 0 = 12
        Console.WriteLine($"아린의 공격! 슬라임에게 {d1} → {slime.HpBar()}");
        int d2 = hero.TakeDamage(slime.Attack);            // 7 - 3 = 4
        Console.WriteLine($"슬라임의 공격! 아린에게 {d2} → {hero.HpBar()}");

        hero.Defending = true;
        int d3 = hero.TakeDamage(slime.Attack);            // 7/2 = 3, 3 - 3 = 0 → 최소 1
        Console.WriteLine($"방어 중! 아린에게 {d3} → {hero.HpBar()}");

        Console.WriteLine($"회복 시도 100 → 실제 회복 {hero.Heal(100)} → {hero.HpBar()}");
        int d4 = slime.TakeDamage(hero.Attack);
        Console.WriteLine($"아린의 공격! 슬라임에게 {d4} → {slime.HpBar()}, 살아 있나? {slime.IsAlive}");
        // hero.Hp = 9999;   // 오류 CS0272: set 접근자가 protected
    }
}`, expect: `아린   [##########] 60/60  공격 12 방어 3
슬라임  [##########] 20/20  공격 7 방어 0
아린의 공격! 슬라임에게 12 → [####......] 8/20
슬라임의 공격! 아린에게 4 → [#########.] 56/60
방어 중! 아린에게 1 → [#########.] 55/60
회복 시도 100 → 실제 회복 5 → [##########] 60/60
아린의 공격! 슬라임에게 12 → [..........] 0/20, 살아 있나? False`, desc: '<code>Math.Max(1, power - Defense)</code> 덕분에 방어력이 높아도 최소 1 의 피해는 들어가고(<code>d3</code>), <code>Math.Max(0, Hp - damage)</code> 덕분에 HP 가 음수가 되지 않습니다(슬라임 0/20). <code>Heal(100)</code> 은 최대 HP 를 넘지 않게 5 만 회복하고 그 양을 돌려줍니다. <code>Hero</code> 의 <code>TakeDamage</code> 는 <code>base.TakeDamage(…)</code> 로 부모 규칙을 그대로 쓰면서 “방어 시 절반” 만 더했습니다.' },
          { type: 'callout', kind: 'info', title: '피해 규칙을 한 곳에', html: '“공격력 − 방어력, 최소 1, HP 0 미만 금지” 를 전투 코드 여기저기에 쓰면 규칙을 바꿀 때(예: 방어력 비율 감소) 모든 곳을 고쳐야 합니다. <code>TakeDamage</code> 한 곳에 두면 한 줄만 고치면 되고, 용사의 방어처럼 <b>특별한 규칙은 override 로 더할</b> 수 있습니다. P02 의 <code>Change</code> 와 같은 생각입니다.' },
          { type: 'h', text: '단계 2. 턴제 전투 반복' },
          { type: 'p', html: '전투는 “<b>상태 출력 → 용사 선택 → 용사 행동 → 적이 쓰러졌나? → 적 행동 → 용사가 쓰러졌나? → 다음 턴</b>” 의 반복입니다. 끝나는 조건이 셋(승리 · 패배 · 도망)이라 <code>for (int turn = 1; ; turn++)</code> 무한 반복 안에서 조건이 되면 <code>return</code> 으로 빠져나갑니다. 턴 번호는 드래곤의 “3턴마다” 규칙에 쓰입니다.' },
          { type: 'figure', html: SVG_TURN, caption: '한 턴의 흐름 — 용사가 먼저 행동하고, 적이 살아 있으면 적이 행동한다' },
          { type: 'code', title: '단계 2. 턴제 전투 — 공격 · 방어 · 도망', stdin: '2\n1\n3\n1\n1\n1\n1\n1\n', code: `using System;

${CS_CHARACTER}

class Hero : Character
{
    public bool Defending { get; set; }
    public Hero(string name) : base(name, 60, 12, 3) { }
    public override int TakeDamage(int power) => base.TakeDamage(Defending ? power / 2 : power);
}

class Monster : Character
{
    public Monster(string name, int hp, int attack, int defense) : base(name, hp, attack, defense) { }
}

class Program
{
    static readonly Random rng = new Random(42);           // 고정 시드 → 언제나 같은 전투

    // 이기면 true, 지거나 도망치면 false
    static bool Fight(Hero hero, Monster enemy)
    {
        Console.WriteLine($"{enemy.Name}(이)가 나타났다!");
        for (int turn = 1; ; turn++)
        {
            Console.WriteLine($"--- {turn}턴 ---  {hero.Name} {hero.HpBar()}  |  {enemy.Name} {enemy.HpBar()}");
            Console.Write("1.공격 2.방어 3.도망 > ");
            string cmd = (Console.ReadLine() ?? "1").Trim();   // 입력이 끝나면 공격
            hero.Defending = false;

            if (cmd == "1")
            {
                int power = hero.Attack + rng.Next(-2, 3);     // -2 ~ +2 흔들림
                bool critical = rng.Next(100) < 15;              // 15% 치명타
                if (critical) power *= 2;
                int damage = enemy.TakeDamage(power);
                Console.WriteLine($"{hero.Name}의 공격!{(critical ? " 치명타!" : "")} {enemy.Name}에게 {damage}의 피해.");
            }
            else if (cmd == "2")
            {
                hero.Defending = true;
                Console.WriteLine($"{hero.Name}은(는) 방패를 들었다.");
            }
            else if (cmd == "3")
            {
                if (rng.Next(100) < 50) { Console.WriteLine("무사히 도망쳤다!"); return false; }
                Console.WriteLine("도망치지 못했다!");
            }
            else
                Console.WriteLine("머뭇거리는 사이 기회를 놓쳤다...");

            if (!enemy.IsAlive) { Console.WriteLine($"{enemy.Name}을(를) 쓰러뜨렸다!"); return true; }

            int taken = hero.TakeDamage(enemy.Attack + rng.Next(-2, 3));
            Console.WriteLine($"{enemy.Name}의 공격! {hero.Name}에게 {taken}의 피해!");
            if (!hero.IsAlive) { Console.WriteLine($"{hero.Name}은(는) 쓰러졌다..."); return false; }
        }
    }

    static void Main()
    {
        var hero = new Hero("아린");
        bool won = Fight(hero, new Monster("고블린", 32, 10, 2));
        Console.WriteLine(won ? $"승리! 남은 HP {hero.Hp}" : "전투 종료");
    }
}`, expect: `고블린(이)가 나타났다!
--- 1턴 ---  아린 [##########] 60/60  |  고블린 [##########] 32/32
1.공격 2.방어 3.도망 > 아린은(는) 방패를 들었다.
고블린의 공격! 아린에게 2의 피해!
--- 2턴 ---  아린 [#########.] 58/60  |  고블린 [##########] 32/32
1.공격 2.방어 3.도망 > 아린의 공격! 치명타! 고블린에게 18의 피해.
고블린의 공격! 아린에게 7의 피해!
--- 3턴 ---  아린 [########..] 51/60  |  고블린 [####......] 14/32
1.공격 2.방어 3.도망 > 무사히 도망쳤다!
전투 종료`, desc: '입력: 방어 → 공격 → 도망. 방어한 1턴에는 고블린의 공격이 2 로 줄었고(공격 턴에는 7), 2턴에는 15% 치명타가 터져 18 의 피해를 주었습니다. 3턴의 도망은 <code>rng.Next(100) &lt; 50</code> 이 참이라 성공했습니다(거짓이면 “도망치지 못했다!” 후 그 턴을 잃습니다). 남은 입력은 쓰이지 않습니다. 시드가 42 로 고정되어 있어 같은 입력이면 몇 번을 실행해도 똑같은 전투가 펼쳐집니다. 입력이 끝나면(<code>null</code>) 공격으로 처리해 전투가 반드시 끝나게 했습니다.' },
          { type: 'callout', kind: 'warn', title: '흔한 실수: 방어 상태를 되돌리지 않기', html: '<code>hero.Defending = true</code> 로 바꾼 뒤 다음 턴에 <code>false</code> 로 되돌리지 않으면 용사는 영원히 방어 상태가 됩니다. 그래서 매 턴 선택을 받은 직후 <code>hero.Defending = false;</code> 로 초기화하고, 방어를 고른 경우에만 다시 <code>true</code> 로 만듭니다. “턴마다 초기화해야 하는 상태” 를 찾아내는 것이 턴제 게임의 요령입니다.' },
          { type: 'h', text: '단계 3. 몬스터마다 다른 행동 — 다형성' },
          { type: 'p', html: '슬라임은 그냥 때리고, 고블린은 가끔 두 번 베고, 드래곤은 3턴마다 브레스를 뿜습니다. 전투 코드에 <code>if (enemy.Name == "고블린") … else if (…드래곤…)</code> 을 쓰면 몬스터가 늘 때마다 전투 코드를 고쳐야 합니다. 대신 <code>Monster</code> 에 <b><code>virtual ChooseAttack</code></b> 을 두고 몬스터 클래스마다 <b>override</b> 하면, 전투 코드는 <code>enemy.ChooseAttack(rng, turn)</code> 한 줄로 모든 몬스터를 처리합니다.' },
          { type: 'p', html: '<code>ChooseAttack</code> 은 “무엇을 했는지 설명” 과 “공격력” 두 가지를 돌려줘야 합니다. 이럴 때 <b>튜플 <code>(string Text, int Power)</code></b> 이 편리합니다. 받는 쪽은 <code>var (text, power) = …;</code> 로 한 번에 풀어 받습니다(분해).' },
          { type: 'code', title: '단계 3. virtual ChooseAttack — 몬스터별 행동', code: `using System;
using System.Collections.Generic;

${CS_CHARACTER}

${CS_MONSTERS}

class Program
{
    static void Main()
    {
        var rng = new Random(42);
        List<Monster> monsters = new List<Monster> { new Slime(), new Goblin(), new Dragon() };
        foreach (Monster m in monsters)
            Console.WriteLine($"{m.Name}: HP {m.MaxHp}, 공격 {m.Attack}, 방어 {m.Defense}, 보상 경험치 {m.ExpReward} · 골드 {m.GoldReward}");

        for (int turn = 1; turn <= 6; turn++)
        {
            Console.WriteLine($"--- {turn}턴 ---");
            foreach (Monster m in monsters)
            {
                var (text, power) = m.ChooseAttack(rng, turn);   // 같은 호출, 몬스터마다 다른 행동
                Console.WriteLine($"  {text} (공격력 {power})");
            }
        }
    }
}`, expect: `슬라임: HP 20, 공격 7, 방어 0, 보상 경험치 8 · 골드 5
고블린: HP 32, 공격 10, 방어 2, 보상 경험치 14 · 골드 12
드래곤: HP 80, 공격 13, 방어 4, 보상 경험치 100 · 골드 100
--- 1턴 ---
  슬라임의 공격! (공격력 8)
  고블린이 단검을 두 번 휘둘렀다! (공격력 16)
  드래곤의 공격! (공격력 11)
--- 2턴 ---
  슬라임의 공격! (공격력 7)
  고블린이 단검을 두 번 휘둘렀다! (공격력 16)
  드래곤의 공격! (공격력 12)
--- 3턴 ---
  슬라임의 공격! (공격력 8)
  고블린의 공격! (공격력 8)
  드래곤이 불꽃 브레스를 뿜었다!! (공격력 26)
--- 4턴 ---
  슬라임의 공격! (공격력 8)
  고블린이 단검을 두 번 휘둘렀다! (공격력 16)
  드래곤의 공격! (공격력 12)
--- 5턴 ---
  슬라임의 공격! (공격력 7)
  고블린의 공격! (공격력 9)
  드래곤의 공격! (공격력 12)
--- 6턴 ---
  슬라임의 공격! (공격력 7)
  고블린이 단검을 두 번 휘둘렀다! (공격력 16)
  드래곤이 불꽃 브레스를 뿜었다!! (공격력 26)`, desc: '<code>foreach (Monster m in monsters)</code> 는 세 몬스터를 똑같이 다루지만, <code>m.ChooseAttack</code> 은 실제 객체의 버전이 실행됩니다. 드래곤은 3 · 6턴에 반드시 브레스, 고블린은 30% 확률로 연속 베기를 합니다. 새 몬스터(예: 해골 병사)는 클래스를 하나 <b>추가</b>하기만 하면 되고, 이 반복문도 전투 코드도 고칠 필요가 없습니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 재정의 빨리 만들기', html: '<code>class Goblin : Monster</code> 안에서 <code>override</code> 까지 입력하고 스페이스를 누르면 재정의할 수 있는 멤버 목록(<code>ChooseAttack</code>, <code>TakeDamage</code>, <code>ToString</code> …)이 나타납니다. 고르면 <code>return base.ChooseAttack(rng, turn);</code> 이 들어간 뼈대가 자동으로 만들어집니다. 부모 메서드로 이동하려면 <code>base.ChooseAttack</code> 위에서 <b>F12</b>(정의로 이동).' }
        ],
        practice: [
          {
            title: '실습 P3-3. 새 몬스터 — 해골 병사',
            level: 2,
            desc: '<p><code>Monster</code> 를 상속한 <code>Skeleton</code>(이름 <code>해골 병사</code>, HP 40, 공격 11, 방어 5, 경험치 20, 골드 15)을 만드세요. HP 가 절반 이하가 되면 <b>딱 한 번</b> 공격 대신 “뼈를 다시 맞춰” HP 20 을 회복합니다(공격력 0). 그 외에는 기본 공격입니다.</p><p>시험 코드는 매 턴 용사가 공격력 12 로 때리고 해골이 행동하는 것을 쓰러질 때까지 반복합니다.</p>',
            hint: '<code>private bool revived;</code> 필드로 한 번만 되살아나게 합니다. <code>ChooseAttack</code> 안에서 <code>Heal(20)</code> 을 부를 수 있습니다(Character 의 public 메서드).',
            starter: `using System;

${CS_CHARACTER}

${CS_MONSTERS}

// TODO: class Skeleton : Monster

class Program
{
    static void Main()
    {
        var rng = new Random(42);
        Monster enemy = new Slime();         // TODO: new Skeleton() 으로 바꾸기
        for (int turn = 1; enemy.IsAlive; turn++)
        {
            int damage = enemy.TakeDamage(12);
            Console.Write($"{turn}턴: 용사 공격 {damage} → {enemy.HpBar()}");
            if (!enemy.IsAlive) { Console.WriteLine("  쓰러졌다!"); break; }
            var (text, power) = enemy.ChooseAttack(rng, turn);
            Console.WriteLine($"  / {text} (공격력 {power})");
        }
    }
}
`,
            solution: `using System;

${CS_CHARACTER}

${CS_MONSTERS}

class Skeleton : Monster
{
    private bool revived = false;

    public Skeleton() : base("해골 병사", 40, 11, 5, 20, 15) { }

    public override (string Text, int Power) ChooseAttack(Random rng, int turn)
    {
        if (!revived && Hp <= MaxHp / 2)
        {
            revived = true;
            int healed = Heal(20);
            return ($"{Name}이(가) 뼈를 다시 맞췄다! HP +{healed}", 0);
        }
        return base.ChooseAttack(rng, turn);
    }
}

class Program
{
    static void Main()
    {
        var rng = new Random(42);
        Monster enemy = new Skeleton();
        for (int turn = 1; enemy.IsAlive; turn++)
        {
            int damage = enemy.TakeDamage(12);
            Console.Write($"{turn}턴: 용사 공격 {damage} → {enemy.HpBar()}");
            if (!enemy.IsAlive) { Console.WriteLine("  쓰러졌다!"); break; }
            var (text, power) = enemy.ChooseAttack(rng, turn);
            Console.WriteLine($"  / {text} (공격력 {power})");
        }
    }
}`,
            expect: `1턴: 용사 공격 7 → [########..] 33/40  / 해골 병사의 공격! (공격력 12)
2턴: 용사 공격 7 → [######....] 26/40  / 해골 병사의 공격! (공격력 9)
3턴: 용사 공격 7 → [####......] 19/40  / 해골 병사이(가) 뼈를 다시 맞췄다! HP +20 (공격력 0)
4턴: 용사 공격 7 → [########..] 32/40  / 해골 병사의 공격! (공격력 9)
5턴: 용사 공격 7 → [######....] 25/40  / 해골 병사의 공격! (공격력 11)
6턴: 용사 공격 7 → [####......] 18/40  / 해골 병사의 공격! (공격력 9)
7턴: 용사 공격 7 → [##........] 11/40  / 해골 병사의 공격! (공격력 10)
8턴: 용사 공격 7 → [#.........] 4/40  / 해골 병사의 공격! (공격력 12)
9턴: 용사 공격 7 → [..........] 0/40  쓰러졌다!`
          },
          {
            title: '실습 P3-4. 방어 성공 시 반격',
            level: 3,
            desc: '<p>단계 2 의 전투를 고쳐, 용사가 <b>방어를 고른 턴</b>에 적의 공격을 받은 뒤 살아 있으면 <b>반격</b>(공격력의 절반, <code>hero.Attack / 2</code>)을 하게 하세요. 메시지: <code>반격! 슬라임에게 6의 피해.</code> 반격으로 적이 쓰러지면 승리입니다.</p><p>입력: 방어 → 방어 → 공격 …</p>',
            hint: '적 행동 뒤에 <code>if (hero.Defending &amp;&amp; hero.IsAlive)</code> 로 반격하고, 곧바로 <code>if (!enemy.IsAlive)</code> 를 한 번 더 검사합니다.',
            starter: `using System;

${CS_CHARACTER}

class Hero : Character
{
    public bool Defending { get; set; }
    public Hero(string name) : base(name, 60, 12, 3) { }
    public override int TakeDamage(int power) => base.TakeDamage(Defending ? power / 2 : power);
}

class Monster : Character
{
    public Monster(string name, int hp, int attack, int defense) : base(name, hp, attack, defense) { }
}

class Program
{
    static readonly Random rng = new Random(42);

    static bool Fight(Hero hero, Monster enemy)
    {
        for (int turn = 1; ; turn++)
        {
            Console.Write($"[{turn}턴 {hero.Hp}/{enemy.Hp}] 1.공격 2.방어 > ");
            string cmd = (Console.ReadLine() ?? "1").Trim();
            hero.Defending = cmd == "2";
            if (!hero.Defending)
                Console.WriteLine($"공격! {enemy.Name}에게 {enemy.TakeDamage(hero.Attack + rng.Next(-2, 3))}의 피해.");
            else
                Console.WriteLine("방패를 들었다.");
            if (!enemy.IsAlive) { Console.WriteLine("승리!"); return true; }

            Console.WriteLine($"{enemy.Name}의 공격! {hero.TakeDamage(enemy.Attack + rng.Next(-2, 3))}의 피해!");
            if (!hero.IsAlive) { Console.WriteLine("패배..."); return false; }
            // TODO: 방어 중이었다면 반격 (hero.Attack / 2), 적이 쓰러지면 승리
        }
    }

    static void Main()
    {
        Fight(new Hero("아린"), new Monster("슬라임", 20, 7, 0));
    }
}
`,
            solution: `using System;

${CS_CHARACTER}

class Hero : Character
{
    public bool Defending { get; set; }
    public Hero(string name) : base(name, 60, 12, 3) { }
    public override int TakeDamage(int power) => base.TakeDamage(Defending ? power / 2 : power);
}

class Monster : Character
{
    public Monster(string name, int hp, int attack, int defense) : base(name, hp, attack, defense) { }
}

class Program
{
    static readonly Random rng = new Random(42);

    static bool Fight(Hero hero, Monster enemy)
    {
        for (int turn = 1; ; turn++)
        {
            Console.Write($"[{turn}턴 {hero.Hp}/{enemy.Hp}] 1.공격 2.방어 > ");
            string cmd = (Console.ReadLine() ?? "1").Trim();
            hero.Defending = cmd == "2";
            if (!hero.Defending)
                Console.WriteLine($"공격! {enemy.Name}에게 {enemy.TakeDamage(hero.Attack + rng.Next(-2, 3))}의 피해.");
            else
                Console.WriteLine("방패를 들었다.");
            if (!enemy.IsAlive) { Console.WriteLine("승리!"); return true; }

            Console.WriteLine($"{enemy.Name}의 공격! {hero.TakeDamage(enemy.Attack + rng.Next(-2, 3))}의 피해!");
            if (!hero.IsAlive) { Console.WriteLine("패배..."); return false; }

            if (hero.Defending)
            {
                int counter = enemy.TakeDamage(hero.Attack / 2);
                Console.WriteLine($"반격! {enemy.Name}에게 {counter}의 피해.");
                if (!enemy.IsAlive) { Console.WriteLine("반격으로 승리!"); return true; }
            }
        }
    }

    static void Main()
    {
        Fight(new Hero("아린"), new Monster("슬라임", 20, 7, 0));
    }
}`,
            stdin: '2\n2\n1\n1\n1\n',
            expect: `[1턴 60/20] 1.공격 2.방어 > 방패를 들었다.
슬라임의 공격! 1의 피해!
반격! 슬라임에게 6의 피해.
[2턴 59/14] 1.공격 2.방어 > 방패를 들었다.
슬라임의 공격! 1의 피해!
반격! 슬라임에게 6의 피해.
[3턴 58/8] 1.공격 2.방어 > 공격! 슬라임에게 10의 피해.
승리!`
          }
        ],
        quiz: [
          { q: '<code>TakeDamage</code> 가 <code>Math.Max(1, power - Defense)</code> 로 피해를 계산할 때, 공격력 7 로 방어력 10 인 적을 때리면 피해는?', options: ['-3', '0', '1', '7'], answer: 2, explain: '7 − 10 = −3 이지만 Math.Max(1, −3) = 1. 최소 피해 규칙입니다.' },
          { q: '<code>Hero</code> 의 <code>public override int TakeDamage(int power) =&gt; base.TakeDamage(Defending ? power / 2 : power);</code> 에서 <code>base.TakeDamage</code> 를 쓰는 이유는?', options: ['부모의 피해 규칙(방어력 · 최소 1 · HP 0)을 다시 쓰지 않고 재사용하려고', '무한 재귀를 만들려고', 'static 메서드라서', '컴파일러가 요구해서'], answer: 0, explain: 'base.멤버 는 부모의 구현을 호출합니다. 용사는 “방어 시 절반” 만 더하고 나머지 규칙은 부모에게 맡깁니다.' },
          { q: '다음 코드의 출력은?<pre><code>(string Text, int Power) Act() =&gt; ("브레스!", 26);\nvar (t, p) = Act();\nConsole.WriteLine($"{t} {p * 2}");</code></pre>', options: ['브레스! 26', '브레스! 52', '(브레스!, 26)', '컴파일 오류'], answer: 1, explain: '튜플을 분해해 t = "브레스!", p = 26 을 받습니다. p * 2 = 52.' },
          { q: '전투 코드에 <code>if (enemy.Name == "고블린") … else if (enemy.Name == "드래곤") …</code> 을 쓰는 대신 <code>enemy.ChooseAttack(rng, turn)</code> 을 쓰는 장점은?', options: ['실행이 빠르다', '새 몬스터를 추가할 때 전투 코드를 고칠 필요가 없다', '몬스터 이름을 바꿀 수 없게 된다', 'Random 을 쓰지 않아도 된다'], answer: 1, explain: '행동을 각 몬스터 클래스가 override 로 정하므로, 몬스터가 늘어도 전투 코드는 그대로입니다(다형성, 개방-폐쇄 원칙).' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ① — 캐릭터와 턴제 전투', subtitle: 'Project 03 · 콘솔 텍스트 게임 — 2교시', badge: 'P03-2',
            notes: '<p><b>[복습 3분]</b> 1교시 클래스 그림에서 Character · Hero · Monster 를 가리키며 “오늘은 이 셋과 전투를 만듭니다.”</p>' },
          { layout: 'bullets', title: '단계 1 — Character 의 규칙', lead: 'HP 는 protected set — 메서드로만 바꾼다',
            bullets: ['<code>TakeDamage(power)</code>: 공격력 − 방어력, <b>최소 1</b>, HP <b>0 미만 금지</b>', '<code>Heal(amount)</code>: <b>최대 HP 초과 금지</b>, 실제 회복량 반환', '<code>IsAlive =&gt; Hp &gt; 0</code>', '<code>HpBar()</code>: <code>[######....] 36/60</code>', 'Hero: 방어 중이면 피해 절반 (override + base)'],
            notes: '<p><b>[4분]</b> 발문: “HP 를 public set 으로 두면 어떤 버그가 생길까?” → 음수 HP, 최대치 초과, 치트. P02 의 잔액 보호와 같은 원리.</p>' },
          { layout: 'code', title: '단계 1. 피해와 회복 규칙', code: `using System;
abstract class Character
{
    public int MaxHp { get; }
    public int Hp { get; protected set; }
    public int Defense { get; }
    protected Character(int hp, int def) { MaxHp = hp; Hp = hp; Defense = def; }
    public virtual int TakeDamage(int power)
    {
        int damage = Math.Max(1, power - Defense);     // 최소 1
        Hp = Math.Max(0, Hp - damage);                 // 0 미만 금지
        return damage;
    }
    public int Heal(int amount)
    {
        int before = Hp;
        Hp = Math.Min(MaxHp, Hp + amount);             // 최대 초과 금지
        return Hp - before;
    }
}
class Monster : Character { public Monster(int hp, int def) : base(hp, def) { } }

class Program
{
    static void Main()
    {
        var m = new Monster(30, 10);                   // HP 30, 방어 10
        Console.WriteLine($"{m.TakeDamage(7)} {m.TakeDamage(25)} → {m.Hp}, 회복 {m.Heal(100)}");
    }
}`, points: ['<code>Math.Max</code> / <code>Math.Min</code> 으로 범위 지키기', '실제 피해 · 회복량을 돌려준다', '<code>virtual</code> → 자식이 규칙 추가 가능'],
            notes: '<p><b>[5분]</b> 출력 “1 15 → 14, 회복 16” 을 먼저 예측하게 한 뒤 실행하세요.</p>' },
          { layout: 'diagram', title: '단계 2 — 한 턴의 흐름', html: SVG_TURN, caption: '용사 행동 → 적 HP 확인 → 적 행동 → 용사 HP 확인',
            notes: '<p><b>[4분]</b> 끝나는 조건 세 가지(승리 · 패배 · 도망)를 찾게 하세요. 그래서 조건 없는 for + return 구조.</p>' },
          { layout: 'code', title: '단계 2. 턴제 전투 뼈대', stdin: '1\n2\n1\n1\n1\n', code: `using System;

class Program
{
    static void Main()
    {
        var rng = new Random(42);
        int heroHp = 60, enemyHp = 32;
        for (int turn = 1; ; turn++)
        {
            Console.Write($"[{turn}턴 아린 {heroHp} | 고블린 {enemyHp}] 1.공격 2.방어 > ");
            string cmd = Console.ReadLine() ?? "1";
            bool defending = cmd == "2";
            if (!defending)
            {
                int dmg = Math.Max(1, 12 + rng.Next(-2, 3) - 2);
                if (rng.Next(100) < 15) dmg *= 2;             // 치명타
                enemyHp = Math.Max(0, enemyHp - dmg);
                Console.WriteLine($"공격! {dmg}의 피해");
            }
            if (enemyHp == 0) { Console.WriteLine("승리!"); break; }

            int power = 10 + rng.Next(-2, 3);
            int taken = Math.Max(1, (defending ? power / 2 : power) - 3);
            heroHp = Math.Max(0, heroHp - taken);
            Console.WriteLine($"고블린의 공격! {taken}의 피해");
            if (heroHp == 0) { Console.WriteLine("패배..."); break; }
        }
    }
}`, points: ['<code>for (int turn = 1; ; turn++)</code>', '용사 → 적 확인 → 적 → 용사 확인', '고정 시드라 언제나 같은 전투', '본문은 클래스 버전'],
            notes: '<p><b>[6분]</b> 클래스 없이 변수로만 쓴 축약판입니다. “이 코드에서 규칙(최소 1, 0 미만 금지)이 몇 번 반복되나요?” → 그래서 Character 메서드로 모은다.</p>' },
          { layout: 'bullets', title: '턴마다 초기화할 것', lead: '방어는 “그 턴만”',
            bullets: ['선택 직후 <code>hero.Defending = false;</code>', '방어를 고른 경우만 <code>true</code>', '입력 끝(<code>null</code>) → 공격으로 처리해 무한 반복 방지', '잘못된 입력 → 턴을 잃는다 (메시지)'],
            notes: '<p><b>[3분]</b> Defending 초기화를 빼고 실행하면 계속 방어 상태가 되는 버그를 시연하세요.</p>' },
          { layout: 'two', title: '단계 3 — 몬스터 행동: if 문 vs 다형성', left: { title: '✗ 전투 코드에 if', code: `if (enemy.Name == "고블린")
    ... 연속 베기
else if (enemy.Name == "드래곤")
    ... 브레스
else
    ... 기본 공격`, run: false }, right: { title: '✔ virtual + override', code: `// 전투 코드는 한 줄
var (text, power) =
    enemy.ChooseAttack(rng, turn);

// 각 몬스터 클래스가 정한다
class Dragon : Monster
{
    public override (string, int) ChooseAttack(...)
}`, run: false },
            notes: '<p><b>[4분]</b> 몬스터가 20종이 되면 왼쪽 코드가 어떻게 될지 상상하게 하세요.</p>' },
          { layout: 'code', title: '단계 3. override 와 튜플', code: `using System;
using System.Collections.Generic;
class Monster {
    public string Name { get; }
    public int Attack { get; }
    public Monster(string n, int a) { Name = n; Attack = a; }
    public virtual (string Text, int Power) ChooseAttack(int turn) => ($"{Name}의 공격!", Attack);
}
class Dragon : Monster
{
    public Dragon() : base("드래곤", 13) { }
    public override (string Text, int Power) ChooseAttack(int turn)
    {
        if (turn % 3 == 0) return ("불꽃 브레스!!", 26);
        return base.ChooseAttack(turn);
    }
}

class Program
{
    static void Main()
    {
        var list = new List<Monster> { new Monster("슬라임", 7), new Dragon() };
        for (int turn = 1; turn <= 3; turn++)
            foreach (Monster m in list)
                Console.WriteLine($"{turn}턴 {m.ChooseAttack(turn).Text} ({m.ChooseAttack(turn).Power})");
        var (text, power) = new Dragon().ChooseAttack(6);    // 분해해서 받기
        Console.WriteLine($"6턴 드래곤: {text} / {power}");
    }
}`, points: ['<code>(string Text, int Power)</code> 튜플 반환', '<code>var (text, power) = …</code> 분해', '<code>turn % 3 == 0</code>: 3턴마다', '<code>base.ChooseAttack</code>: 기본 행동'],
            notes: '<p><b>[5분]</b> 3턴에 드래곤만 브레스를 쓰는 것을 확인. “브레스 턴을 미리 알 수 있다면 어떻게 대비할까?” → 방어! 게임 전략이 코드 규칙에서 나온다는 것을 보여 줍니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '방어력 3 인 용사가 방어 중(공격력 절반)일 때 공격력 11 의 공격을 받으면 피해는? (<code>11 / 2</code> 는 정수 나눗셈)', options: ['1', '2', '5', '8'], answer: 1, explain: '11 / 2 = 5 (정수), 5 − 3 = 2. 최소 1 보다 크므로 2.',
            notes: '<p><b>[2분]</b> 정수 나눗셈을 놓친 학생은 5.5 − 3 = 2.5 로 계산합니다. int 끼리의 나눗셈을 다시 짚어 주세요.</p>' },
          { layout: 'practice', title: '실습 P3-3. 해골 병사', desc: 'HP 절반 이하가 되면 <b>한 번만</b> HP 20 회복하는 <code>Skeleton : Monster</code>', starter: `using System;

class Monster
{
    public string Name { get; }
    public int Hp { get; protected set; }
    public int MaxHp { get; }
    public Monster(string n, int hp) { Name = n; Hp = MaxHp = hp; }
    public void Hit(int d) => Hp = Math.Max(0, Hp - d);
    public virtual string Act() => $"{Name}의 공격!";
}

// TODO: class Skeleton : Monster — 절반 이하일 때 한 번 회복

class Program
{
    static void Main()
    {
        Monster m = new Monster("해골 병사", 40);   // TODO: new Skeleton()
        while (m.Hp > 0) { m.Hit(7); Console.WriteLine($"HP {m.Hp} / {m.Act()}"); }
    }
}`, solution: `using System;

class Monster
{
    public string Name { get; }
    public int Hp { get; protected set; }
    public int MaxHp { get; }
    public Monster(string n, int hp) { Name = n; Hp = MaxHp = hp; }
    public void Hit(int d) => Hp = Math.Max(0, Hp - d);
    public virtual string Act() => $"{Name}의 공격!";
}

class Skeleton : Monster
{
    private bool revived;
    public Skeleton() : base("해골 병사", 40) { }
    public override string Act()
    {
        if (!revived && Hp > 0 && Hp <= MaxHp / 2)
        {
            revived = true;
            Hp = Math.Min(MaxHp, Hp + 20);
            return "뼈를 다시 맞췄다! HP +20";
        }
        return base.Act();
    }
}

class Program
{
    static void Main()
    {
        Monster m = new Skeleton();
        while (m.Hp > 0) { m.Hit(7); Console.WriteLine($"HP {m.Hp} / {m.Act()}"); }
    }
}`,
            notes: '<p><b>[실습 안내]</b> “한 번만” 을 bool 필드로 기억하는 것이 핵심입니다. 필드 없이 만들면 매 턴 회복해 절대 쓰러지지 않는 몬스터가 됩니다 — 일부러 겪어 보게 해도 좋습니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['Character: 피해 · 회복 규칙을 한 곳에 (protected set)', 'Hero: <code>override TakeDamage</code> + <code>base</code> 로 방어 규칙 추가', '턴제 전투: <code>for (;;)</code> + 승리 · 패배 · 도망에서 <code>return</code>', '몬스터 행동: <code>virtual ChooseAttack</code> → 종류마다 override', '튜플 <code>(Text, Power)</code> 로 두 값 반환 · 분해'],
            notes: '<p>다음 시간: 가방(Dictionary)과 아이템, 경험치 · 레벨 업, 던전 탐험 상태 기계.</p>' }
        ]
      },

      /* =========================================================== 3교시 */
      {
        id: 'p03-3',
        title: '단계별 구현 ② — 인벤토리 · 성장 · 던전 탐험',
        minutes: 50,
        goals: [
          'Dictionary<ItemType, int> 로 가방을 만들고, 아이템 사용을 switch 로 구현할 수 있다',
          '경험치와 레벨 업 규칙을 while 반복으로 구현할 수 있다',
          'enum GameState 와 RoomType 으로 던전 탐험 상태 기계를 작성할 수 있다'
        ],
        flow: [['복습 · 목표', 3], ['단계 4: 가방 · 아이템', 13], ['단계 5: 경험치 · 레벨 업', 9], ['단계 6: 던전 탐험', 15], ['실습 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '단계 4. 가방 — Dictionary<ItemType, int>' },
          { type: 'p', html: '가방에는 “어떤 아이템이 몇 개” 있는지만 알면 됩니다. 키가 아이템 종류(enum), 값이 개수인 <b><code>Dictionary&lt;ItemType, int&gt;</code></b> 가 딱 맞습니다. 없는 키를 읽으면 예외가 나므로 <code>GetValueOrDefault(키)</code>(없으면 0)를 씁니다. 보물 상자는 <code>(ItemType)rng.Next(3)</code> 으로 정수를 enum 으로 바꿔 아이템 종류를 무작위로 정합니다.' },
          { type: 'table', head: ['아이템', 'enum', '효과', '전투 밖에서'], rows: [
            ['포션', '<code>ItemType.Potion</code> (0)', 'HP +30', '사용 가능'],
            ['폭탄', '<code>ItemType.Bomb</code> (1)', '적에게 25 (방어 무시)', '“던질 상대가 없다”'],
            ['엘릭서', '<code>ItemType.Elixir</code> (2)', 'HP 가득', '사용 가능']
          ] },
          { type: 'code', title: '단계 4. 가방과 아이템 사용 · 보물 상자', code: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_ENUMS}

${CS_CHARACTER}

${CS_HERO}

${CS_MONSTERS}

class Program
{
    static void Main()
    {
        var rng = new Random(42);
        var hero = new Hero("아린");
        Console.WriteLine($"처음 가방: {hero.BagText()}");

        for (int i = 1; i <= 3; i++)
        {
            int gold = rng.Next(10, 31);
            ItemType item = (ItemType)rng.Next(3);        // 0, 1, 2 → Potion, Bomb, Elixir
            hero.Gold += gold;
            hero.AddItem(item);
            Console.WriteLine($"보물 상자 {i}: 골드 {gold}, {Items.Name(item)} ({item} = {(int)item})");
        }
        Console.WriteLine($"가방: {hero.BagText()} / 골드 {hero.Gold}");

        hero.TakeDamage(40);
        Console.WriteLine($"함정에 빠졌다! {hero.HpBar()}");
        var slime = new Slime();
        Console.WriteLine(hero.UseItem(ItemType.Potion, null));
        Console.WriteLine(hero.UseItem(ItemType.Bomb, null));        // 전투 밖
        Console.WriteLine(hero.UseItem(ItemType.Bomb, slime) + $" → {slime.HpBar()}");
        Console.WriteLine(hero.UseItem(ItemType.Elixir, null));
        Console.WriteLine(hero.UseItem(ItemType.Elixir, null));
        Console.WriteLine($"가방: {hero.BagText()} / {hero.HpBar()}");
    }
}`, expect: `처음 가방: 포션 x2, 폭탄 x1, 엘릭서 x0
보물 상자 1: 골드 24, 포션 (Potion = 0)
보물 상자 2: 골드 12, 폭탄 (Bomb = 1)
보물 상자 3: 골드 13, 포션 (Potion = 0)
가방: 포션 x4, 폭탄 x2, 엘릭서 x0 / 골드 49
함정에 빠졌다! [###.......] 23/60
포션을 마셨다. HP +30
폭탄을 던질 상대가 없다.
폭탄을 던졌다! 슬라임에게 25의 피해. → [..........] 0/20
엘릭서이(가) 없다!
엘릭서이(가) 없다!
가방: 포션 x3, 폭탄 x1, 엘릭서 x0 / [########..] 53/60`, desc: '보물 상자에서 엘릭서가 한 번도 나오지 않아 마지막 두 번의 엘릭서 사용은 “없다!” 로 거절되었습니다. 전투 밖에서 던진 폭탄은 개수가 줄지 않은 것도 확인하세요(폭탄 x2 → 슬라임에게 던진 뒤 x1). <code>AddItem</code> 은 <code>Bag[type] = Bag.GetValueOrDefault(type) + count</code> 한 줄로 “없으면 0 에서 시작해 더하기” 를 합니다. <code>UseItem</code> 은 개수가 0 이면 사용을 거절하고, 종류마다 다른 효과를 <code>switch</code> 로 처리합니다. 폭탄은 <code>TakeDamage(25 + enemy.Defense)</code> 로 방어력만큼 더해 <b>방어를 무시한 25</b> 가 들어가게 했습니다. <code>BagText</code> 는 LINQ <code>Select</code> + <code>string.Join</code> 으로 가방 내용을 한 줄로 만듭니다.' },
          { type: 'callout', kind: 'info', title: '사용자 번호 → enum 은 검사 후에', html: '전투 중 “1.포션 2.폭탄 3.엘릭서” 에서 사용자가 고른 번호를 <code>(ItemType)(n - 1)</code> 로 바꿉니다. 그런데 <code>(ItemType)7</code> 도 <b>오류 없이 만들어집니다</b>(enum 은 속이 정수라서). 그래서 완성본의 <code>AskItem</code> 은 <code>Enum.IsDefined(typeof(ItemType), n - 1)</code> 로 먼저 확인합니다.' },
          { type: 'h', text: '단계 5. 경험치와 레벨 업' },
          { type: 'p', html: '레벨 업에 필요한 경험치는 <code>Level * 20</code> 입니다. 드래곤처럼 경험치를 한꺼번에 많이 주면 <b>두 번 이상</b> 레벨이 오를 수 있으므로 <code>if</code> 가 아니라 <b><code>while</code></b> 로 “남은 경험치가 필요량 이상인 동안” 반복합니다. 레벨이 오르면 능력치가 오르고 HP 가 가득 찹니다.' },
          { type: 'code', title: '단계 5. GainExp — while 로 여러 번 레벨 업', code: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_ENUMS}

${CS_CHARACTER}

${CS_HERO}

class Program
{
    static void Main()
    {
        var hero = new Hero("아린");
        int[] rewards = { 8, 14, 8, 30, 100 };          // 슬라임, 고블린, 슬라임, ?, 드래곤
        Console.WriteLine($"시작: Lv.{hero.Level} ({hero.Exp}/{hero.ExpToNext})  HP {hero.MaxHp}, 공격 {hero.Attack}, 방어 {hero.Defense}");
        foreach (int exp in rewards)
        {
            int before = hero.Level;
            bool up = hero.GainExp(exp);
            string msg = up ? $"  레벨 업! (+{hero.Level - before}) HP {hero.MaxHp}, 공격 {hero.Attack}, 방어 {hero.Defense}" : "";
            Console.WriteLine($"경험치 +{exp,3} → Lv.{hero.Level} ({hero.Exp}/{hero.ExpToNext}){msg}");
        }
    }
}`, expect: `시작: Lv.1 (0/20)  HP 60, 공격 12, 방어 3
경험치 +  8 → Lv.1 (8/20)
경험치 + 14 → Lv.2 (2/40)  레벨 업! (+1) HP 70, 공격 15, 방어 4
경험치 +  8 → Lv.2 (10/40)
경험치 + 30 → Lv.3 (0/60)  레벨 업! (+1) HP 80, 공격 18, 방어 5
경험치 +100 → Lv.4 (40/80)  레벨 업! (+1) HP 90, 공격 21, 방어 6`, desc: '경험치 22 가 되면 20 을 쓰고 2 가 남아 Lv.2 (2/40) 이 됩니다. 마지막 +100 은 Lv.3 에서 60 을 써서 Lv.4, 남은 40 은 다음 필요량 80 보다 작아 멈춥니다. <code>ExpToNext</code> 는 <code>Level * 20</code> 을 계산하는 속성이라 레벨이 오르면 자동으로 커집니다. 레벨 업 공식(×20)을 바꾸면 게임 속도가 달라집니다 — 4교시 밸런스 조정에서 다룹니다.' },
          { type: 'h', text: '단계 6. 던전 탐험 — 상태 기계' },
          { type: 'p', html: '던전은 <code>RoomType[] map</code> 배열이고, 지금 있는 방 번호 <code>room</code> 과 게임 상태 <code>state</code> 두 변수로 진행을 관리합니다. 메인 반복은 <b><code>while (state == GameState.Exploring)</code></b> 이고, 방 종류에 따라 <code>switch (map[room])</code> 로 다른 일이 일어납니다. 보스를 이기면 <code>Victory</code>, 쓰러지면 <code>GameOver</code>, 포기하면 <code>Quit</code> 로 바뀌어 반복이 끝납니다.' },
          { type: 'figure', html: SVG_MAP, caption: '던전 지도 — room 이 0 → 5 로 늘어나며 진행한다' },
          { type: 'p', html: '이 단계에서는 탐험 흐름에 집중하기 위해 전투를 <b>자동 전투</b>(<code>QuickFight</code>: 서로 번갈아 기본 공격만)로 처리합니다. 4교시 완성본에서 2교시의 턴제 전투(<code>Battle.Fight</code>)로 바꿔 끼웁니다.' },
          { type: 'code', title: '단계 6. 던전 탐험 상태 기계 (자동 전투 버전)', stdin: '2\n1\n1\n1\n9\n1\n1\n2\n1\n', code: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_ENUMS}

${CS_SCREEN}

${CS_CHARACTER}

${CS_HERO}

${CS_MONSTERS}

class Program
{
    static readonly Random rng = new Random(42);
    static readonly RoomType[] map =
        { RoomType.Monster, RoomType.Treasure, RoomType.Monster, RoomType.Fountain, RoomType.Monster, RoomType.Boss };

    // 단계 6 의 자동 전투: 서로 기본 공격만 주고받는다 (완성본에서는 Battle.Fight)
    static BattleResult QuickFight(Hero hero, Monster enemy)
    {
        int turn = 1;
        while (hero.IsAlive && enemy.IsAlive)
        {
            enemy.TakeDamage(hero.Attack + rng.Next(-2, 3));
            if (enemy.IsAlive) hero.TakeDamage(enemy.ChooseAttack(rng, turn).Power);
            turn++;
        }
        Console.WriteLine($"  {enemy.Name}과(와) {turn - 1}턴 싸움 → {(hero.IsAlive ? "승리" : "패배")}  {hero.HpBar()}");
        if (!hero.IsAlive) return BattleResult.Lost;
        hero.Gold += enemy.GoldReward;
        if (hero.GainExp(enemy.ExpReward)) Screen.Say($"  레벨 업! Lv.{hero.Level}", ConsoleColor.Magenta);
        return BattleResult.Won;
    }

    static void Main()
    {
        var hero = new Hero("아린");
        GameState state = GameState.Exploring;
        int room = 0;
        while (state == GameState.Exploring)
        {
            Console.Write($"[방 {room + 1}/{map.Length}] {hero.HpBar()} 1.앞으로 2.상태 0.포기 > ");
            string? cmd = Console.ReadLine();
            if (cmd == null || cmd == "0") { state = GameState.Quit; break; }
            if (cmd == "2") { Console.WriteLine($"  Lv.{hero.Level} 경험치 {hero.Exp}/{hero.ExpToNext} 골드 {hero.Gold} | {hero.BagText()}"); continue; }
            if (cmd != "1") { Console.WriteLine("  잘못된 선택"); continue; }

            RoomType type = map[room];
            Console.WriteLine($"  → {type} 방");                       // enum 이름이 그대로 출력된다
            switch (type)
            {
                case RoomType.Monster:
                    Monster m = rng.Next(100) < 50 ? new Slime() : new Goblin();
                    if (QuickFight(hero, m) == BattleResult.Lost) state = GameState.GameOver;
                    else room++;
                    break;
                case RoomType.Treasure:
                    int gold = rng.Next(10, 31);
                    hero.Gold += gold;
                    Screen.Say($"  보물 상자! 골드 +{gold}", ConsoleColor.Yellow);
                    room++;
                    break;
                case RoomType.Fountain:
                    Screen.Say($"  샘물을 마셨다. HP +{hero.Heal(hero.MaxHp / 2)}", ConsoleColor.Green);
                    room++;
                    break;
                case RoomType.Boss:
                    state = QuickFight(hero, new Dragon()) == BattleResult.Won ? GameState.Victory : GameState.GameOver;
                    break;
            }
        }
        Console.WriteLine($"게임 종료: {state}");
    }
}`, expect: `[방 1/6] [##########] 60/60 1.앞으로 2.상태 0.포기 >   Lv.1 경험치 0/20 골드 0 | 포션 x2, 폭탄 x1, 엘릭서 x0
[방 1/6] [##########] 60/60 1.앞으로 2.상태 0.포기 >   → Monster 방
  고블린과(와) 4턴 싸움 → 승리  [####......] 27/60
[방 2/6] [####......] 27/60 1.앞으로 2.상태 0.포기 >   → Treasure 방
  보물 상자! 골드 +25
[방 3/6] [####......] 27/60 1.앞으로 2.상태 0.포기 >   → Monster 방
  슬라임과(와) 2턴 싸움 → 승리  [###.......] 23/60
  레벨 업! Lv.2
[방 4/6] [##########] 70/70 1.앞으로 2.상태 0.포기 >   잘못된 선택
[방 4/6] [##########] 70/70 1.앞으로 2.상태 0.포기 >   → Fountain 방
  샘물을 마셨다. HP +0
[방 5/6] [##########] 70/70 1.앞으로 2.상태 0.포기 >   → Monster 방
  슬라임과(와) 2턴 싸움 → 승리  [#########.] 67/70
[방 6/6] [#########.] 67/70 1.앞으로 2.상태 0.포기 >   Lv.2 경험치 10/40 골드 47 | 포션 x2, 폭탄 x1, 엘릭서 x0
[방 6/6] [#########.] 67/70 1.앞으로 2.상태 0.포기 >   → Boss 방
  드래곤과(와) 6턴 싸움 → 패배  [..........] 0/70
게임 종료: GameOver`, desc: '상태 기계가 방 1 → 6 까지 진행하고, 잘못된 입력(9)은 방을 옮기지 않습니다. 레벨 업으로 HP 가 가득 찬 뒤라 샘물은 +0 이었습니다(방 순서 설계의 문제 — 밸런스 조정 거리). 그리고 결과는 <b>GameOver</b>: 공격만 주고받는 자동 전투로는 3턴마다 26 의 브레스를 맞아 드래곤을 이길 수 없습니다. <b>방어 · 아이템을 고를 수 있는 턴제 전투</b>가 필요한 이유이며, 4교시 완성본에서 <code>QuickFight</code> 를 <code>Battle.Fight</code> 로 바꿉니다. <code>{type}</code> · <code>{state}</code> 처럼 enum 을 출력하면 이름(Monster, GameOver)이 그대로 나옵니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 상태 패턴 (State Pattern)', html: '상태가 많아지면(마을 · 상점 · 던전 · 전투 · 대화 …) <code>switch (state)</code> 가 거대해집니다. 이때는 상태마다 클래스를 만들고 <code>interface IGameState { IGameState Update(); }</code> 처럼 “다음 상태를 돌려주는” 메서드를 구현하게 하는 <b>상태 패턴</b>을 씁니다. 이 역시 인터페이스 + 다형성의 응용입니다.' }
        ],
        practice: [
          {
            title: '실습 P3-5. 상점 — 골드로 아이템 사기',
            level: 2,
            desc: '<p>골드 50 을 가진 용사가 들르는 상점 <code>Shop(Hero hero)</code> 를 만드세요. 메뉴 <code>[상점] 골드 50 | 1.포션 15G 2.폭탄 25G 0.나가기 &gt; </code> 를 반복해서 보여 주고, 골드가 모자라면 <code>골드가 15 모자란다.</code>, 없는 번호면 <code>그런 물건은 없다.</code> 를 출력합니다. 산 아이템은 가방에 넣습니다.</p>',
            hint: '<code>int price = cmd == "1" ? 15 : 25;</code> · <code>ItemType item = cmd == "1" ? ItemType.Potion : ItemType.Bomb;</code> — 번호가 1, 2 가 아니면 먼저 걸러 내세요.',
            starter: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_ENUMS}

${CS_CHARACTER}

${CS_HERO}

class Program
{
    static void Shop(Hero hero)
    {
        while (true)
        {
            Console.Write($"[상점] 골드 {hero.Gold} | 1.포션 15G 2.폭탄 25G 0.나가기 > ");
            string? cmd = Console.ReadLine();
            if (cmd == null || cmd == "0") { Console.WriteLine("상점을 나왔다."); return; }
            // TODO: 번호 확인 → 골드 확인 → 사기
        }
    }

    static void Main()
    {
        var hero = new Hero("아린") { Gold = 50 };
        Shop(hero);
        Console.WriteLine($"가방: {hero.BagText()} / 골드 {hero.Gold}");
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.Linq;

${CS_ENUMS}

${CS_CHARACTER}

${CS_HERO}

class Program
{
    static void Shop(Hero hero)
    {
        while (true)
        {
            Console.Write($"[상점] 골드 {hero.Gold} | 1.포션 15G 2.폭탄 25G 0.나가기 > ");
            string? cmd = Console.ReadLine();
            if (cmd == null || cmd == "0") { Console.WriteLine("상점을 나왔다."); return; }
            if (cmd != "1" && cmd != "2") { Console.WriteLine("그런 물건은 없다."); continue; }
            int price = cmd == "1" ? 15 : 25;
            ItemType item = cmd == "1" ? ItemType.Potion : ItemType.Bomb;
            if (hero.Gold < price) { Console.WriteLine($"골드가 {price - hero.Gold} 모자란다."); continue; }
            hero.Gold -= price;
            hero.AddItem(item);
            Console.WriteLine($"{Items.Name(item)}을(를) 샀다.");
        }
    }

    static void Main()
    {
        var hero = new Hero("아린") { Gold = 50 };
        Shop(hero);
        Console.WriteLine($"가방: {hero.BagText()} / 골드 {hero.Gold}");
    }
}`,
            stdin: '1\n2\n2\n3\n1\n0\n',
            expect: `[상점] 골드 50 | 1.포션 15G 2.폭탄 25G 0.나가기 > 포션을(를) 샀다.
[상점] 골드 35 | 1.포션 15G 2.폭탄 25G 0.나가기 > 폭탄을(를) 샀다.
[상점] 골드 10 | 1.포션 15G 2.폭탄 25G 0.나가기 > 골드가 15 모자란다.
[상점] 골드 10 | 1.포션 15G 2.폭탄 25G 0.나가기 > 그런 물건은 없다.
[상점] 골드 10 | 1.포션 15G 2.폭탄 25G 0.나가기 > 골드가 5 모자란다.
[상점] 골드 10 | 1.포션 15G 2.폭탄 25G 0.나가기 > 상점을 나왔다.
가방: 포션 x3, 폭탄 x2, 엘릭서 x0 / 골드 10`
          },
          {
            title: '실습 P3-6. 새 방 종류 — 함정',
            level: 2,
            desc: '<p><code>RoomType</code> 에 <code>Trap</code> 을 추가하고, 함정 방에서는 <code>rng.Next(8, 14)</code> 의 공격력으로 피해를 입게 하세요(메시지 <code>함정! 가시에 찔려 5의 피해.</code>). 지도 <code>{ Treasure, Trap, Fountain, Trap }</code> 를 자동으로 끝까지 지나가며 방마다 결과와 HP 막대를 출력합니다.</p>',
            hint: 'enum 에 값을 추가하면 <code>switch</code> 에 <code>case RoomType.Trap:</code> 을 추가해야 합니다. 빠뜨린 case 를 찾는 데 <code>default:</code> 의 “처리하지 않은 방” 메시지가 도움이 됩니다.',
            starter: `using System;
using System.Collections.Generic;
using System.Linq;

enum RoomType { Monster, Treasure, Fountain, Boss }     // TODO: Trap 추가
enum ItemType { Potion, Bomb, Elixir }

static class Items
{
    public static string Name(ItemType t) => t.ToString();
}

${CS_CHARACTER}

${CS_HERO}

class Program
{
    static void Main()
    {
        var rng = new Random(42);
        var hero = new Hero("아린");
        RoomType[] map = { RoomType.Treasure, RoomType.Fountain };   // TODO: { Treasure, Trap, Fountain, Trap }
        foreach (RoomType room in map)
        {
            switch (room)
            {
                case RoomType.Treasure:
                    int gold = rng.Next(10, 31);
                    hero.Gold += gold;
                    Console.Write($"보물! 골드 +{gold}.");
                    break;
                case RoomType.Fountain:
                    Console.Write($"샘물! HP +{hero.Heal(hero.MaxHp / 2)}.");
                    break;
                // TODO: case RoomType.Trap
                default:
                    Console.Write($"처리하지 않은 방: {room}");
                    break;
            }
            Console.WriteLine($"  {hero.HpBar()}");
        }
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.Linq;

enum RoomType { Monster, Treasure, Fountain, Boss, Trap }
enum ItemType { Potion, Bomb, Elixir }

static class Items
{
    public static string Name(ItemType t) => t.ToString();
}

${CS_CHARACTER}

${CS_HERO}

class Program
{
    static void Main()
    {
        var rng = new Random(42);
        var hero = new Hero("아린");
        RoomType[] map = { RoomType.Treasure, RoomType.Trap, RoomType.Fountain, RoomType.Trap };
        foreach (RoomType room in map)
        {
            switch (room)
            {
                case RoomType.Treasure:
                    int gold = rng.Next(10, 31);
                    hero.Gold += gold;
                    Console.Write($"보물! 골드 +{gold}.");
                    break;
                case RoomType.Fountain:
                    Console.Write($"샘물! HP +{hero.Heal(hero.MaxHp / 2)}.");
                    break;
                case RoomType.Trap:
                    int damage = hero.TakeDamage(rng.Next(8, 14));
                    Console.Write($"함정! 가시에 찔려 {damage}의 피해.");
                    break;
                default:
                    Console.Write($"처리하지 않은 방: {room}");
                    break;
            }
            Console.WriteLine($"  {hero.HpBar()}");
        }
    }
}`,
            expect: `보물! 골드 +24.  [##########] 60/60
함정! 가시에 찔려 5의 피해.  [#########.] 55/60
샘물! HP +5.  [##########] 60/60
함정! 가시에 찔려 5의 피해.  [#########.] 55/60`
          }
        ],
        quiz: [
          { q: '<code>var bag = new Dictionary&lt;ItemType, int&gt;();</code> 에서 한 번도 넣지 않은 키로 <code>bag[ItemType.Bomb]</code> 을 읽으면?', options: ['0', 'null', 'KeyNotFoundException', '-1'], answer: 2, explain: '인덱서로 없는 키를 읽으면 예외입니다. 없으면 0 을 받고 싶다면 <code>GetValueOrDefault(ItemType.Bomb)</code>.' },
          { q: '<code>Level * 20</code> 이 필요 경험치일 때, Lv.1 · 경험치 0 인 용사가 경험치 70 을 한 번에 얻으면? (레벨 업 시 필요량만큼 차감)', options: ['Lv.2 (50/40)', 'Lv.3 (10/60)', 'Lv.4 (0/80)', 'Lv.2 (30/40)'], answer: 1, explain: '70 − 20 = 50 → Lv.2 (필요 40), 50 − 40 = 10 → Lv.3 (필요 60), 10 &lt; 60 에서 멈춤. 그래서 if 가 아니라 while.' },
          { q: '<code>(ItemType)7</code> 을 실행하면? (<code>enum ItemType { Potion, Bomb, Elixir }</code>)', options: ['컴파일 오류', '예외 발생', '값이 7 인 ItemType 이 만들어진다 (정의되지 않은 값)', 'Elixir 가 된다'], answer: 2, explain: 'enum 은 정수이므로 변환 자체는 막지 않습니다. 사용자 입력을 바꿀 때는 Enum.IsDefined 로 먼저 검사해야 합니다.' },
          { q: '던전 탐험 반복 <code>while (state == GameState.Exploring)</code> 이 끝나는 경우가 <b>아닌</b> 것은?', options: ['보스를 이겨 state 가 Victory', '용사가 쓰러져 GameOver', '0 을 골라 Quit', '보물 상자를 열어 room 이 늘어남'], answer: 3, explain: '보물 상자는 room 만 늘리고 상태는 Exploring 그대로입니다. 반복은 상태가 바뀔 때만 끝납니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ② — 인벤토리 · 성장 · 던전 탐험', subtitle: 'Project 03 · 콘솔 텍스트 게임 — 3교시', badge: 'P03-3',
            notes: '<p><b>[복습 3분]</b> 2교시 전투를 실행해 보여 주고 “이제 아이템과 성장, 그리고 방을 이동하는 탐험을 붙입니다.”</p>' },
          { layout: 'table', title: '단계 4 — 가방 = Dictionary', head: ['코드', '뜻'], rows: [['<code>Dictionary&lt;ItemType, int&gt;</code>', '종류 → 개수'], ['<code>Bag.GetValueOrDefault(t)</code>', '없으면 0'], ['<code>Bag[t] = … + 1</code>', '하나 추가'], ['<code>(ItemType)rng.Next(3)</code>', '무작위 종류'], ['<code>Enum.IsDefined(…)</code>', '사용자 번호 검사']],
            lead: '“무엇이 몇 개” → 키-값',
            notes: '<p><b>[4분]</b> List&lt;string&gt; 로 “포션, 포션, 폭탄” 을 담는 방법과 비교: 개수를 세려면 매번 Count 해야 한다. Dictionary 는 바로 알 수 있다.</p>' },
          { layout: 'code', title: '단계 4. 아이템 사용 switch', code: `using System;
using System.Collections.Generic;

enum ItemType { Potion, Bomb, Elixir }

class Program
{
    static Dictionary<ItemType, int> bag = new Dictionary<ItemType, int> { [ItemType.Potion] = 1 };
    static int hp = 20, maxHp = 60;

    static string Use(ItemType t)
    {
        if (bag.GetValueOrDefault(t) == 0) return $"{t} 이(가) 없다!";
        bag[t]--;
        switch (t)
        {
            case ItemType.Potion: hp = Math.Min(maxHp, hp + 30); return $"포션! HP {hp}";
            case ItemType.Elixir: hp = maxHp; return $"엘릭서! HP {hp}";
            default: return "폭탄은 전투에서!";
        }
    }

    static void Main()
    {
        Console.WriteLine(Use(ItemType.Potion));
        Console.WriteLine(Use(ItemType.Potion));
        bag[ItemType.Elixir] = bag.GetValueOrDefault(ItemType.Elixir) + 1;
        Console.WriteLine(Use(ItemType.Elixir));
    }
}`, points: ['개수 확인 → 차감 → 효과', 'enum 으로 switch', '<code>GetValueOrDefault(t) + 1</code> 로 추가'],
            notes: '<p><b>[5분]</b> 본문은 Hero.UseItem 에 같은 코드가 있습니다. “개수 차감을 효과보다 먼저 하면 생길 수 있는 문제?” → 폭탄을 전투 밖에서 쓰면 개수만 줄어듦 → 본문은 폭탄만 대상 확인 후 차감.</p>' },
          { layout: 'bullets', title: '단계 5 — 레벨 업은 while', lead: '한 번에 여러 레벨이 오를 수 있다',
            bullets: ['필요 경험치 <code>ExpToNext =&gt; Level * 20</code>', '<code>while (Exp &gt;= ExpToNext)</code> — if 가 아니다', '차감 → Level++ → 능력치 상승 → HP 가득', '드래곤 경험치 100 → Lv.3 에서 한 번에 Lv.4'],
            notes: '<p><b>[4분]</b> if 로 바꿔 실행하면 경험치 100 을 받아도 한 레벨만 오르고 경험치가 필요량보다 많은 채로 남는 버그가 생깁니다. 직접 보여 주세요.</p>' },
          { layout: 'code', title: '단계 5. GainExp', code: `using System;

class Program
{
    static int level = 1, exp = 0;
    static int ExpToNext => level * 20;

    static void GainExp(int amount)
    {
        exp += amount;
        while (exp >= ExpToNext)          // if 로 바꾸면?
        {
            exp -= ExpToNext;
            level++;
            Console.WriteLine($"  레벨 업! Lv.{level}");
        }
        Console.WriteLine($"+{amount} → Lv.{level} ({exp}/{ExpToNext})");
    }

    static void Main()
    {
        GainExp(8);
        GainExp(14);
        GainExp(100);
    }
}`, points: ['필요량은 레벨에 따라 커진다', '<code>while</code> 로 남은 만큼 반복', '공식을 바꾸면 게임 속도가 바뀐다'],
            notes: '<p><b>[4분]</b> 공식(×20)을 ×10, ×40 으로 바꿔 실행하며 게임 밸런스가 숫자 하나로 달라진다는 것을 느끼게 합니다.</p>' },
          { layout: 'diagram', title: '단계 6 — 던전 지도', html: SVG_MAP, caption: 'RoomType[] map + int room',
            notes: '<p><b>[3분]</b> 지도는 배열, 현재 위치는 인덱스. room++ 가 “다음 방으로”. 도망치면 room 이 그대로라 같은 방에 다시 도전.</p>' },
          { layout: 'code', title: '단계 6. 상태 기계 뼈대', stdin: '1\n1\n1\n', code: `using System;

enum GameState { Exploring, Victory, GameOver, Quit }
enum RoomType { Monster, Treasure, Boss }

class Program
{
    static void Main()
    {
        RoomType[] map = { RoomType.Monster, RoomType.Treasure, RoomType.Boss };
        GameState state = GameState.Exploring;
        int room = 0;
        while (state == GameState.Exploring)
        {
            Console.Write($"[방 {room + 1}] 1.앞으로 0.포기 > ");
            string? cmd = Console.ReadLine();
            if (cmd == null || cmd == "0") { state = GameState.Quit; break; }
            switch (map[room])
            {
                case RoomType.Monster: Console.WriteLine("몬스터를 물리쳤다!"); room++; break;
                case RoomType.Treasure: Console.WriteLine("보물 상자!"); room++; break;
                case RoomType.Boss: Console.WriteLine("보스 격파!"); state = GameState.Victory; break;
            }
        }
        Console.WriteLine($"결과: {state}");
    }
}`, points: ['<code>while (state == Exploring)</code>', '<code>switch (map[room])</code>: 방마다 다른 일', '상태가 바뀌면 반복 종료', 'null(입력 끝) → Quit'],
            notes: '<p><b>[5분]</b> stdin 을 <code>1 0</code> 으로 바꿔 Quit 경로를, <code>1 1 1</code> 로 Victory 경로를 확인합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '레벨 업 코드를 <code>while</code> 대신 <code>if</code> 로 쓰면 Lv.1(0/20) 용사가 경험치 70 을 얻었을 때?', options: ['Lv.3 (10/60)', 'Lv.2 (50/40) — 경험치가 필요량보다 많은 채로 남는다', 'Lv.1 (70/20)', '예외 발생'], answer: 1, explain: 'if 는 한 번만 검사하므로 Lv.2 에서 멈추고 50/40 이 됩니다. 다음 경험치를 얻을 때까지 레벨이 늦게 오릅니다.',
            notes: '<p><b>[2분]</b> “가끔만 나타나는 버그” 의 좋은 예: 경험치를 조금씩 얻을 때는 문제가 안 보이고, 드래곤을 잡을 때만 드러납니다.</p>' },
          { layout: 'practice', title: '실습 P3-5. 상점', desc: '골드 50 으로 포션(15G) · 폭탄(25G) 사기. 골드 부족 · 없는 번호 처리', starter: `using System;
using System.Collections.Generic;

enum ItemType { Potion, Bomb }

class Program
{
    static void Main()
    {
        int gold = 50;
        var bag = new Dictionary<ItemType, int>();
        while (true)
        {
            Console.Write($"[상점] 골드 {gold} | 1.포션 15G 2.폭탄 25G 0.나가기 > ");
            string? cmd = Console.ReadLine();
            if (cmd == null || cmd == "0") break;
            // TODO: 가격 확인 → 골드 확인 → bag 에 추가
        }
        Console.WriteLine($"포션 {bag.GetValueOrDefault(ItemType.Potion)}, 폭탄 {bag.GetValueOrDefault(ItemType.Bomb)}, 골드 {gold}");
    }
}`, solution: `using System;
using System.Collections.Generic;

enum ItemType { Potion, Bomb }

class Program
{
    static void Main()
    {
        int gold = 50;
        var bag = new Dictionary<ItemType, int>();
        while (true)
        {
            Console.Write($"[상점] 골드 {gold} | 1.포션 15G 2.폭탄 25G 0.나가기 > ");
            string? cmd = Console.ReadLine();
            if (cmd == null || cmd == "0") break;
            if (cmd != "1" && cmd != "2") { Console.WriteLine("그런 물건은 없다."); continue; }
            int price = cmd == "1" ? 15 : 25;
            ItemType item = cmd == "1" ? ItemType.Potion : ItemType.Bomb;
            if (gold < price) { Console.WriteLine($"골드가 {price - gold} 모자란다."); continue; }
            gold -= price;
            bag[item] = bag.GetValueOrDefault(item) + 1;
            Console.WriteLine($"{item} 구입!");
        }
        Console.WriteLine($"포션 {bag.GetValueOrDefault(ItemType.Potion)}, 폭탄 {bag.GetValueOrDefault(ItemType.Bomb)}, 골드 {gold}");
    }
}`, stdin: '1\n2\n2\n0\n',
            notes: '<p><b>[실습 안내]</b> “골드 확인 → 차감 → 추가” 순서가 P02 의 “검사 → 출금 → 입금” 과 같다는 것을 연결해 주세요. 빠른 학생은 P3-6(함정 방).</p>' },
          { layout: 'summary', title: '정리', bullets: ['가방: <code>Dictionary&lt;ItemType, int&gt;</code> + <code>GetValueOrDefault</code>', '정수 → enum 은 <code>Enum.IsDefined</code> 검사 후', '레벨 업: <code>while (Exp &gt;= ExpToNext)</code>', '던전: <code>RoomType[] map</code> + <code>room</code> + <code>switch</code>', '상태 기계: <code>while (state == GameState.Exploring)</code>'],
            notes: '<p>다음 시간: 턴제 전투를 탐험에 끼워 완성하고, 저장 · 불러오기, 밸런스 조정, 확장 과제.</p>' }
        ]
      },

      /* =========================================================== 4교시 */
      {
        id: 'p03-4',
        title: '완성과 확장',
        minutes: 50,
        goals: [
          '게임 상태를 key=value 형식의 텍스트 파일로 저장하고, Dictionary · Enum.TryParse 로 안전하게 불러올 수 있다',
          '지금까지의 클래스를 역할별 파일로 나누어 완성 프로그램을 구성하고, 고정 시드로 플레이를 재현해 테스트할 수 있다',
          '규칙 숫자를 바꿔 게임 밸런스를 조정하고, 새 몬스터 · 기록 저장 같은 확장 기능을 구현할 수 있다'
        ],
        flow: [['복습 · 목표', 3], ['단계 7: 저장 · 불러오기', 12], ['완성 프로그램', 13], ['테스트 · 밸런스', 7], ['확장 과제', 10], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '단계 7. 게임 저장 · 불러오기' },
          { type: 'p', html: '게임을 저장하려면 “다시 시작할 때 필요한 모든 값” — 이름 · 레벨 · 경험치 · HP · 능력치 · 골드 · 현재 방 · 가방 — 을 파일에 써야 합니다. 이번에는 한 줄에 <b><code>이름=값</code></b> 하나씩 쓰는 형식을 씁니다(설정 파일 · .ini 와 비슷). CSV 와 달리 <b>순서가 바뀌거나 항목이 늘어나도</b> 이름으로 찾으므로 튼튼합니다.' },
          { type: 'list', items: [
            '저장: 값마다 <code>$"level={hero.Level}"</code> 한 줄 → <code>File.WriteAllLines</code>. 가방은 enum 이름 그대로 <code>Potion=2</code>',
            '불러오기: 줄마다 <code>=</code> 위치를 찾아 앞은 키, 뒤는 값 → <code>Dictionary&lt;string, string&gt;</code>',
            '숫자는 <code>int.Parse</code>, 아이템은 <code>Enum.TryParse(키, out ItemType t)</code> 로 “아이템 줄인지” 까지 한 번에 확인',
            '필요한 키가 없거나(<code>KeyNotFoundException</code>) 숫자가 아니면(<code>FormatException</code>) “손상된 파일” 로 처리'
          ] },
          { type: 'code', title: '단계 7. key=value 파일로 저장 · 불러오기', code: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

${CS_ENUMS}

${CS_CHARACTER}

${CS_HERO}

class Program
{
    static void Save(Hero hero, int room, string path)
    {
        var lines = new List<string>
        {
            $"name={hero.Name}", $"level={hero.Level}", $"exp={hero.Exp}", $"hp={hero.Hp}", $"maxhp={hero.MaxHp}",
            $"attack={hero.Attack}", $"defense={hero.Defense}", $"gold={hero.Gold}", $"room={room}"
        };
        foreach (var kv in hero.Bag)
            lines.Add($"{kv.Key}={kv.Value}");                   // Potion=2
        File.WriteAllLines(path, lines);
    }

    static Hero? Load(string path, out int room)
    {
        room = 0;
        var data = new Dictionary<string, string>();
        foreach (string line in File.ReadAllLines(path))
        {
            int eq = line.IndexOf('=');
            if (eq > 0) data[line.Substring(0, eq)] = line.Substring(eq + 1);
        }
        try
        {
            var hero = new Hero(data["name"]);
            hero.Restore(int.Parse(data["level"]), int.Parse(data["exp"]), int.Parse(data["hp"]), int.Parse(data["maxhp"]),
                         int.Parse(data["attack"]), int.Parse(data["defense"]), int.Parse(data["gold"]));
            foreach (var kv in data)
                if (Enum.TryParse(kv.Key, out ItemType type) && int.TryParse(kv.Value, out int count))
                    hero.Bag[type] = count;                       // 아이템 줄만 골라낸다
            room = int.Parse(data["room"]);
            return hero;
        }
        catch (Exception ex) when (ex is KeyNotFoundException || ex is FormatException)
        {
            Console.WriteLine($"손상된 저장 파일: {ex.GetType().Name}");
            return null;
        }
    }

    static void Main()
    {
        var hero = new Hero("아린");
        hero.GainExp(30);                     // Lv.2
        hero.Gold = 57;
        hero.AddItem(ItemType.Elixir);
        hero.TakeDamage(20);
        Save(hero, 3, "save_demo.txt");
        Console.WriteLine("--- save_demo.txt ---");
        Console.Write(File.ReadAllText("save_demo.txt"));

        Hero? loaded = Load("save_demo.txt", out int room);
        if (loaded != null)
            Console.WriteLine($"불러옴: {loaded.Name} Lv.{loaded.Level} {loaded.HpBar()} 골드 {loaded.Gold} 방 {room + 1} | {loaded.BagText()}");

        File.WriteAllText("broken.txt", "name=아린\\nlevel=둘\\n");          // 일부러 망가진 파일
        Load("broken.txt", out _);
    }
}`, expect: `--- save_demo.txt ---
name=아린
level=2
exp=10
hp=54
maxhp=70
attack=15
defense=4
gold=57
room=3
Potion=2
Bomb=1
Elixir=1
불러옴: 아린 Lv.2 [#######...] 54/70 골드 57 방 4 | 포션 x2, 폭탄 x1, 엘릭서 x1
손상된 저장 파일: FormatException`, desc: '<code>catch (Exception ex) when (…)</code> 는 조건이 맞는 예외만 잡는 <b>예외 필터</b>입니다. <code>"level=둘"</code> 은 <code>int.Parse</code> 에서 <code>FormatException</code> 이 납니다. <code>Restore</code> 는 저장된 능력치를 되살리는 Hero 의 메서드로, <code>private set</code> 인 <code>Level</code> 도 클래스 안이라 바꿀 수 있습니다. <code>out _</code> 는 “이 out 값은 버린다” 는 뜻입니다.' },
          { type: 'callout', kind: 'warn', title: '저장 파일은 믿지 말 것', html: '플레이어가 메모장으로 <code>gold=99999999</code> 로 고칠 수도 있습니다. 싱글 게임이라면 괜찮지만, 순위 · 온라인 기능이 있다면 값의 범위를 검사하거나(레벨 1~99, HP ≤ 최대 HP) 파일 내용으로 계산한 <b>체크섬</b>을 함께 저장해 변조를 알아내야 합니다. 최소한 이 예제처럼 <b>망가진 파일 때문에 게임이 멈추지 않게</b>는 해야 합니다.' },
          { type: 'h', text: '완성 — 파일 구성' },
          { type: 'table', head: ['파일', '내용'], rows: [
            ['<code>Enums.cs</code>', '<code>GameState</code> · <code>ItemType</code> · <code>RoomType</code> · <code>BattleResult</code> + 아이템 이름'],
            ['<code>Screen.cs</code>', '색 출력 <code>Say</code>'],
            ['<code>Character.cs</code>', '추상 클래스 — 피해 · 회복 · HP 막대'],
            ['<code>Hero.cs</code>', '레벨 · 경험치 · 가방 · 아이템 사용 · 복원'],
            ['<code>Monsters.cs</code>', '<code>Monster</code> + <code>Slime</code> · <code>Goblin</code> · <code>Dragon</code>'],
            ['<code>Battle.cs</code>', '턴제 전투 <code>Fight</code> · 아이템 고르기 <code>AskItem</code>'],
            ['<code>Game.cs</code>', '던전 상태 기계 · 저장 · 불러오기'],
            ['<code>Program.cs</code>', '시작 화면 · 시드 · 결말 출력']
          ] },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 실행 인수로 시드 바꾸기', html: '<b>프로젝트 속성 → 디버그 → 일반 → 디버그 시작 프로필 UI 열기</b>에서 <b>명령줄 인수</b>에 <code>7</code> 을 넣고, <code>static void Main(string[] args)</code> 에서 <code>int seed = args.Length &gt; 0 ? int.Parse(args[0]) : 42;</code> 로 받으면 코드를 고치지 않고 다른 던전을 시험할 수 있습니다. 버그를 제보받으면 “시드 + 입력 순서” 만 알면 그대로 재현됩니다.' },
          { type: 'p', html: '아래 완성 프로그램은 시작 화면에서 새 게임을 고르고, 상태 확인 · 저장 · 아이템 사용을 섞어 가며 드래곤까지 진행하는 플레이를 입력으로 넣은 것입니다. <b>시드가 42 로 고정</b>되어 있으므로 같은 입력이면 언제, 누가 실행해도 이 결과가 나옵니다.' },
          { type: 'code', title: '완성 프로그램. 던전 탐험 RPG (파일 분리 버전)', stdin: FINAL_STDIN, code: FINAL_CODE, expect: FINAL_EXPECT, desc: '입력 시나리오: 새 게임 → 상태 보기 → 방 1 고블린(첫 공격부터 치명타) → 방 2 보물(폭탄 획득) → <b>저장</b> → 방 3 슬라임(레벨 업) → 방 4 샘물(HP 가 가득이라 +0) → 방 5 고블린 → 방 6 드래곤. 보스전에서는 폭탄 두 개로 50 을 먼저 깎고, 브레스가 오는 <b>3 · 6턴에 방어</b>해 피해를 22 → 9 로 줄이고, 5턴에 포션으로 버틴 끝에 8턴에 승리합니다. 2교시 단계 6 의 자동 전투(공격만)가 드래곤에게 졌던 것과 비교해 보세요. 저장된 <code>save.txt</code> 가 있으면 다음에 시작 화면에서 <code>2</code> 로 방 3 부터 이어서 할 수 있습니다.' },
          { type: 'h', text: '테스트와 밸런스 조정' },
          { type: 'p', html: '시드를 고정한 덕분에 “같은 입력 → 같은 결과” 가 보장되므로, 규칙을 하나씩 확인하는 테스트 플레이를 만들 수 있습니다. 또 규칙 숫자를 바꾸고 같은 입력으로 다시 실행하면 <b>변화의 영향만</b> 비교할 수 있습니다.' },
          { type: 'table', head: ['확인할 것', '방법', '기대 결과'], rows: [
            ['방어 규칙', '드래곤 3턴째에 방어', '브레스 피해가 절반 이하'],
            ['아이템 없음', '엘릭서 0 개일 때 사용', '“엘릭서이(가) 없다!”, 턴만 잃음'],
            ['잘못된 입력', '메뉴에 9, 아이템 번호에 7', '안내 후 계속'],
            ['입력 끝', '입력이 도중에 끝남', '탐험: 포기(Quit), 전투: 공격으로 진행 → 무한 반복 없음'],
            ['저장 · 불러오기', '저장 후 시작 화면에서 2', '같은 방 · 능력치 · 가방으로 시작'],
            ['손상된 저장 파일', 'level=둘', '“손상되어 불러올 수 없습니다”, 새 게임']
          ] },
          { type: 'table', caption: '밸런스 조정 — 숫자 하나가 게임을 바꾼다', head: ['값', '지금', '올리면', '내리면'], rows: [
            ['치명타 확률', '15%', '전투가 짧고 운이 커진다', '전투가 길고 예측 가능'],
            ['레벨 업 필요량', '레벨 × 20', '성장이 느려 보스가 어렵다', '금방 강해져 긴장감이 준다'],
            ['드래곤 브레스', '26 (3턴마다)', '방어를 꼭 써야 한다', '그냥 공격만 해도 이긴다'],
            ['샘물 회복', 'HP 절반', '보스 직전이 쉬워진다', '포션 관리가 중요해진다']
          ] },
          { type: 'h', text: '확장 아이디어' },
          { type: 'list', items: [
            '<b>보스 2단계</b>: HP 가 절반 이하가 되면 분노해 공격력 상승 (실습 P3-7)',
            '<b>명예의 전당</b>: 클리어 기록을 파일에 쌓고 상위 3명 표시 (실습 P3-8)',
            '<b>상점 방</b>: 실습 P3-5 의 상점을 <code>RoomType.Shop</code> 으로 던전에 넣기',
            '<b>무작위 지도</b>: <code>map</code> 을 시드로 섞어 매번 다른 던전 (단, 같은 시드면 같은 지도)',
            '<b>직업</b>: <code>Hero</code> 를 상속한 <code>Warrior</code>(방어 ↑) · <code>Mage</code>(스킬) — 스킬은 인터페이스 <code>ISkill</code>',
            '<b>WPF 로 옮기기</b>: <code>Battle</code> 의 Console 부분만 버튼 · 텍스트로 바꾸면 Part 2 의 창 게임이 된다'
          ] }
        ],
        practice: [
          {
            title: '실습 P3-7. [확장] 보스 2단계 — 분노한 드래곤',
            level: 2,
            desc: '<p><code>Dragon</code> 을 상속한 <code>RagingDragon</code> 을 만드세요. HP 가 절반 이하가 된 뒤 처음 행동할 때 <b>한 번만</b> <code>드래곤이 분노했다! 공격력 +5</code> 를 알리고 공격력을 5 올린 다음 공격합니다(분노한 턴에도 브레스 규칙은 그대로). 시험 코드는 매 턴 용사가 공격력 16 으로 때리고 드래곤이 행동하는 것을 쓰러질 때까지 반복합니다.</p>',
            hint: '<code>Attack</code> 은 <code>protected set</code> 이라 파생 클래스에서 <code>Attack += 5;</code> 가 됩니다. 분노 메시지와 공격 설명을 합쳐 <code>($"드래곤이 분노했다! 공격력 +5 / {text}", power)</code> 로 돌려주세요.',
            starter: `using System;

${CS_CHARACTER}

${CS_MONSTERS}

// TODO: class RagingDragon : Dragon

class Program
{
    static void Main()
    {
        var rng = new Random(42);
        Monster boss = new Dragon();          // TODO: new RagingDragon()
        for (int turn = 1; ; turn++)
        {
            boss.TakeDamage(16);
            if (!boss.IsAlive) { Console.WriteLine($"{turn}턴: 드래곤 쓰러짐!"); break; }
            var (text, power) = boss.ChooseAttack(rng, turn);
            Console.WriteLine($"{turn}턴: {boss.HpBar()}  {text} (공격력 {power})");
        }
    }
}
`,
            solution: `using System;

${CS_CHARACTER}

${CS_MONSTERS}

class RagingDragon : Dragon
{
    private bool enraged = false;

    public override (string Text, int Power) ChooseAttack(Random rng, int turn)
    {
        if (!enraged && Hp <= MaxHp / 2)
        {
            enraged = true;
            Attack += 5;
            var (text, power) = base.ChooseAttack(rng, turn);
            return ($"드래곤이 분노했다! 공격력 +5 / {text}", power);
        }
        return base.ChooseAttack(rng, turn);
    }
}

class Program
{
    static void Main()
    {
        var rng = new Random(42);
        Monster boss = new RagingDragon();
        for (int turn = 1; ; turn++)
        {
            boss.TakeDamage(16);
            if (!boss.IsAlive) { Console.WriteLine($"{turn}턴: 드래곤 쓰러짐!"); break; }
            var (text, power) = boss.ChooseAttack(rng, turn);
            Console.WriteLine($"{turn}턴: {boss.HpBar()}  {text} (공격력 {power})");
        }
    }
}`,
            expect: `1턴: [########..] 68/80  드래곤의 공격! (공격력 14)
2턴: [#######...] 56/80  드래곤의 공격! (공격력 11)
3턴: [#####.....] 44/80  드래곤이 불꽃 브레스를 뿜었다!! (공격력 26)
4턴: [####......] 32/80  드래곤이 분노했다! 공격력 +5 / 드래곤의 공격! (공격력 16)
5턴: [##........] 20/80  드래곤의 공격! (공격력 18)
6턴: [#.........] 8/80  드래곤이 불꽃 브레스를 뿜었다!! (공격력 26)
7턴: 드래곤 쓰러짐!`
          },
          {
            title: '실습 P3-8. [확장] 명예의 전당',
            level: 3,
            desc: '<p>클리어 기록을 <code>halloffame.txt</code> 에 <code>이름,레벨,골드</code> 한 줄씩 <b>덧붙이고</b>(<code>File.AppendAllText</code>), 파일 전체를 읽어 <b>레벨 높은 순, 같으면 골드 많은 순</b>으로 상위 3명을 출력하세요. 잘못된 줄은 건너뜁니다. (연습을 위해 처음에 예전 기록 파일을 만들어 두고 시작합니다.)</p>',
            hint: '<code>record Score(string Name, int Level, int Gold);</code> · <code>Split(\',\')</code> + <code>int.TryParse</code> → <code>OrderByDescending(s =&gt; s.Level).ThenByDescending(s =&gt; s.Gold).Take(3)</code>',
            starter: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

record Score(string Name, int Level, int Gold);

class Program
{
    const string FileName = "halloffame.txt";

    static void AddRecord(string name, int level, int gold)
    {
        // TODO: File.AppendAllText 로 "이름,레벨,골드" 한 줄 덧붙이기
    }

    static List<Score> ReadAll()
    {
        var list = new List<Score>();
        // TODO: 줄마다 Split → TryParse → Score 추가 (잘못된 줄은 건너뛰기)
        return list;
    }

    static void Main()
    {
        File.WriteAllLines(FileName, new[] { "바람,3,120", "하늘,5,340", "잘못된 기록", "구름,2,60" });   // 예전 기록
        AddRecord("아린", 4, 210);
        AddRecord("별빛", 5, 95);
        var all = ReadAll();
        Console.WriteLine($"기록 {all.Count}개");
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

record Score(string Name, int Level, int Gold);

class Program
{
    const string FileName = "halloffame.txt";

    static void AddRecord(string name, int level, int gold)
    {
        File.AppendAllText(FileName, $"{name},{level},{gold}\\n");
    }

    static List<Score> ReadAll()
    {
        var list = new List<Score>();
        foreach (string line in File.ReadAllLines(FileName))
        {
            string[] p = line.Split(',');
            if (p.Length == 3 && int.TryParse(p[1], out int level) && int.TryParse(p[2], out int gold))
                list.Add(new Score(p[0], level, gold));
        }
        return list;
    }

    static void Main()
    {
        File.WriteAllLines(FileName, new[] { "바람,3,120", "하늘,5,340", "잘못된 기록", "구름,2,60" });   // 예전 기록
        AddRecord("아린", 4, 210);
        AddRecord("별빛", 5, 95);
        var all = ReadAll();
        Console.WriteLine($"기록 {all.Count}개");
        var top = all.OrderByDescending(s => s.Level).ThenByDescending(s => s.Gold).Take(3);
        int rank = 1;
        foreach (Score s in top)
            Console.WriteLine($"{rank++}위 {s.Name} Lv.{s.Level} 골드 {s.Gold}");
    }
}`,
            expect: `기록 5개
1위 하늘 Lv.5 골드 340
2위 별빛 Lv.5 골드 95
3위 아린 Lv.4 골드 210`
          }
        ],
        quiz: [
          { q: '저장 형식으로 CSV 한 줄(<code>아린,2,10,54,…</code>) 대신 <code>level=2</code> 처럼 key=value 를 쓰는 장점은?', options: ['파일이 더 작다', '항목 순서가 바뀌거나 새 항목이 추가되어도 이름으로 찾을 수 있다', '숫자를 저장할 수 없다', '암호화된다'], answer: 1, explain: 'CSV 는 “몇 번째 칸” 으로 값을 찾기 때문에 항목을 추가하면 예전 파일과 어긋납니다. key=value 는 이름으로 찾습니다.' },
          { q: '<code>Enum.TryParse("Potion", out ItemType t)</code> 와 <code>Enum.TryParse("gold", out ItemType u)</code> 의 반환값은?', options: ['true, true', 'true, false', 'false, true', 'false, false'], answer: 1, explain: '"Potion" 은 ItemType 의 이름이라 true, "gold" 는 아니라 false. 그래서 저장 파일에서 아이템 줄만 골라낼 수 있습니다.' },
          { q: '<code>catch (Exception ex) when (ex is FormatException)</code> 의 뜻은?', options: ['모든 예외를 잡는다', 'FormatException 일 때만 이 catch 가 잡는다', 'FormatException 을 새로 던진다', '컴파일 오류'], answer: 1, explain: 'when 뒤의 조건이 참일 때만 catch 합니다(예외 필터). 여러 예외를 한 catch 로 묶을 때 편리합니다.' },
          { q: '같은 입력으로 게임을 두 번 실행했는데 결과가 달랐다. 가장 먼저 의심할 것은?', options: ['어딘가에서 시드 없는 new Random() 이나 DateTime.Now 를 쓰고 있다', 'enum 을 썼다', 'Dictionary 를 썼다', 'Console 색을 바꿨다'], answer: 0, explain: '결과가 실행마다 달라지는 원인은 시드 없는 난수, 현재 시각 같은 “밖에서 오는 값” 입니다(P02 의 IClock 과 같은 문제).' }
        ],
        slides: [
          { layout: 'title', title: '완성과 확장', subtitle: 'Project 03 · 콘솔 텍스트 게임 — 4교시', badge: 'P03-4',
            notes: '<p><b>[복습 3분]</b> “게임을 끄면 레벨 3 용사가 사라진다면?” → 저장이 필요하다. 오늘은 저장 · 완성 · 밸런스 · 확장.</p>' },
          { layout: 'two', title: '단계 7 — 저장 형식', left: { title: 'CSV 한 줄', code: `아린,2,10,54,70,15,4,57,3,2,1,1
// 5번째가 뭐였지?
// 항목을 추가하면 예전 파일과 어긋남`, run: false }, right: { title: 'key=value', code: `name=아린
level=2
hp=54
room=3
Potion=2
// 이름으로 찾는다 — 순서 · 추가에 강함`, run: false },
            notes: '<p><b>[3분]</b> 설정 파일(.ini), 환경 변수, HTTP 헤더 등 key=value 는 어디에나 있습니다. JSON 은 이것의 발전형이라고 소개하세요.</p>' },
          { layout: 'code', title: '단계 7. key=value 읽기', code: `using System;
using System.Collections.Generic;
using System.IO;

enum ItemType { Potion, Bomb, Elixir }

class Program
{
    static void Main()
    {
        File.WriteAllLines("s.txt", new[] { "name=아린", "level=2", "Potion=3", "Bomb=0" });

        var data = new Dictionary<string, string>();
        foreach (string line in File.ReadAllLines("s.txt"))
        {
            int eq = line.IndexOf('=');
            if (eq > 0) data[line.Substring(0, eq)] = line.Substring(eq + 1);
        }
        Console.WriteLine($"{data["name"]} Lv.{int.Parse(data["level"])}");
        foreach (var kv in data)
            if (Enum.TryParse(kv.Key, out ItemType t))
                Console.WriteLine($"  아이템 {t}: {kv.Value}개");
    }
}`, points: ['<code>IndexOf(\'=\')</code> 로 키 · 값 나누기', 'Dictionary 에 모아 이름으로 찾기', '<code>Enum.TryParse</code> 로 아이템 줄 골라내기'],
            notes: '<p><b>[5분]</b> “level=둘” 로 바꾸면 int.Parse 에서 예외 → 본문 예제는 when 필터로 잡아 “손상된 파일” 처리. 시연해 보세요.</p>' },
          { layout: 'table', title: '완성 — 파일 구성', head: ['파일', '역할'], rows: [['Enums.cs · Screen.cs', 'enum 4개 · 색 출력'], ['Character.cs · Hero.cs', '캐릭터 규칙 · 용사'], ['Monsters.cs', '몬스터 3종'], ['Battle.cs', '턴제 전투'], ['Game.cs', '던전 상태 기계 · 저장 · 불러오기'], ['Program.cs', '시작 화면 · 시드 · 결말']],
            lead: '한 파일 = 한 가지 역할',
            notes: '<p><b>[3분]</b> 새 몬스터를 추가하려면 어느 파일만 고치면 될까? → Monsters.cs (+ Game.cs 에서 등장시키기). 역할 분리의 효과를 확인합니다.</p>' },
          { layout: 'bullets', title: '완성 프로그램 시연', lead: '같은 시드 + 같은 입력 = 같은 모험',
            bullets: ['새 게임 → 이름 → 상태 확인', '방 1~5: 전투 · 보물 · 샘물 (중간에 저장)', '드래곤: 3턴마다 브레스 → <b>방어</b>로 대비', '결말: Victory / GameOver / Quit 를 switch 로', '입력이 끝나도 멈추지 않음 (null 처리)'],
            notes: '<p><b>[10분]</b> 완성 프로그램을 실행합니다. 두 번 실행해 결과가 똑같은 것을 보여 준 뒤, 학생이 직접 입력을 바꿔 다른 결말을 만들어 보게 하세요. 드래곤 브레스 턴에 방어하지 않으면 어떻게 되는지도 비교해 볼 만합니다.</p>' },
          { layout: 'table', title: '밸런스 조정', head: ['값', '지금', '바꾸면?'], rows: [['치명타', '15%', '올리면 운 게임'], ['레벨 업', '레벨 × 20', '올리면 성장이 느림'], ['브레스', '26 · 3턴마다', '올리면 방어 필수'], ['샘물', 'HP 절반', '내리면 포션이 중요']],
            lead: '규칙 숫자 = 게임 디자인',
            notes: '<p><b>[5분]</b> 모둠마다 숫자 하나를 바꾸고 같은 입력으로 실행해 결과를 비교합니다. 시드가 고정되어 있어 “숫자 변화의 효과” 만 비교할 수 있다는 것이 핵심.</p>' },
          { layout: 'bullets', title: '확장 과제', lead: '새 기능 = 새 클래스 · 새 case',
            bullets: ['보스 2단계 — 분노한 드래곤 (실습 P3-7)', '명예의 전당 파일 (실습 P3-8)', '상점 방 <code>RoomType.Shop</code>', '직업: <code>Warrior</code> · <code>Mage</code> + <code>ISkill</code>', '시드로 섞은 무작위 지도'],
            notes: '<p><b>[10분]</b> P3-7(기초) → P3-8(도전). 직업 확장은 P02 의 인터페이스 설계를 복습하는 좋은 과제입니다.</p>' },
          { layout: 'code', title: '확장 미리 보기: 분노 패턴', code: `using System;

class Boss
{
    public int Hp { get; private set; } = 80;
    public int Attack { get; private set; } = 13;
    private bool enraged;

    public void Hit(int d) => Hp = Math.Max(0, Hp - d);

    public string Act()
    {
        if (!enraged && Hp <= 40)
        {
            enraged = true;
            Attack += 5;
            return $"분노했다! 공격력 {Attack}";
        }
        return $"공격 ({Attack})";
    }
}

class Program
{
    static void Main()
    {
        var boss = new Boss();
        while (boss.Hp > 0) { boss.Hit(12); Console.WriteLine($"HP {boss.Hp,2}: {boss.Act()}"); }
    }
}`, points: ['bool 필드로 “한 번만”', 'HP 비율로 단계 전환', '실습 P3-7 은 Dragon 을 상속해 override'],
            notes: '<p><b>[3분]</b> P3-3 해골 병사의 “한 번만 회복” 과 같은 패턴입니다. 보스 패턴 설계는 게임 기획의 꽃이라고 소개하세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '저장 파일에서 <code>Enum.TryParse(kv.Key, out ItemType t)</code> 를 쓰는 이유는?', options: ['모든 줄을 아이템으로 바꾸려고', '키가 아이템 이름인 줄만 골라 enum 으로 바꾸려고', '파일을 암호화하려고', '예외를 일부러 내려고'], answer: 1, explain: 'name · level 같은 줄은 false, Potion · Bomb 같은 줄만 true 가 되어 가방에 넣을 수 있습니다.',
            notes: '<p><b>[2분]</b> 새 아이템을 enum 에 추가해도 저장 · 불러오기 코드는 고칠 필요가 없다는 점을 짚어 주세요.</p>' },
          { layout: 'practice', title: '실습 P3-8. 명예의 전당', desc: '기록을 <code>AppendAllText</code> 로 덧붙이고, 레벨 → 골드 순으로 상위 3명', starter: `using System;
using System.IO;
using System.Linq;

class Program
{
    static void Main()
    {
        File.WriteAllLines("hof.txt", new[] { "바람,3,120", "하늘,5,340" });
        // TODO: "아린,4,210" 덧붙이기
        // TODO: 읽어서 레벨 → 골드 순 상위 3명
        Console.WriteLine(File.ReadAllLines("hof.txt").Length);
    }
}`, solution: `using System;
using System.IO;
using System.Linq;

class Program
{
    static void Main()
    {
        File.WriteAllLines("hof.txt", new[] { "바람,3,120", "하늘,5,340" });
        File.AppendAllText("hof.txt", "아린,4,210\\n");
        var top = File.ReadAllLines("hof.txt")
                      .Select(l => l.Split(','))
                      .Where(p => p.Length == 3)
                      .Select(p => (Name: p[0], Level: int.Parse(p[1]), Gold: int.Parse(p[2])))
                      .OrderByDescending(s => s.Level).ThenByDescending(s => s.Gold)
                      .Take(3);
        foreach (var s in top)
            Console.WriteLine($"{s.Name} Lv.{s.Level} 골드 {s.Gold}");
    }
}`,
            notes: '<p><b>[실습 안내]</b> WriteAllLines(덮어쓰기)와 AppendAllText(덧붙이기)의 차이를 다시 확인합니다. 본문 실습은 잘못된 줄을 TryParse 로 건너뜁니다.</p>' },
          { layout: 'summary', title: '프로젝트 정리', bullets: ['상속 · 다형성: Character → Hero / Monster → 몬스터별 override', '<code>new Random(42)</code>: 재현 가능한 게임 · 테스트', 'enum: 상태 기계 · 아이템 · 방 · 전투 결과', 'Dictionary 가방, key=value 저장 + Enum.TryParse', '규칙 숫자 = 밸런스, 새 기능 = 새 클래스', 'C# 기초 파트 프로젝트 완료 → 다음: WPF 로 창 프로그램'],
            notes: '<p>P01(데이터 · LINQ · 파일) → P02(규칙을 지키는 객체) → P03(상속 · 다형성 · 상태)로 이어진 C# 기초 프로젝트를 정리합니다. 다음 P04 부터는 WPF 로 창을 가진 프로그램을 만듭니다.</p>' }
        ]
      }
    ]
  });
})();
