"use client";

import { useMemo, useRef, useState } from "react";

type NameLen = 2 | 3;

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * ✅ 姓氏库（扩充）
 * 以单字姓为主，少量复姓提高“小说感”
 */
const SURNAMES_SINGLE = [
  "李","王","张","刘","陈","杨","赵","黄","周","吴","徐","孙","胡","朱","高","林","何","郭","马","罗","梁","宋","郑","谢","韩","唐","冯","于","董","萧","程","曹","袁","邓","许","沈","曾","彭","吕","苏","卢","蒋","蔡","贾","丁","魏","薛","叶","阎","段","顾","孟","白","秦","孔","严","尹","邵","武","方","江","夏","石","易","常","温","凌","楚","崔","谭","黎","庄","纪","卓","陆","裴","钟","邢","蓝","宁","景","应","司","文","阮","雷","安","郁","杭","汪","梅","莫","樊","侯","霍","葛","冷","颜","慕",
  // 更“仙侠”的常见姓（可重复没关系，但我稍微去重过）
  "洛","云","风","夜","墨","星","月",
];

const SURNAMES_DOUBLE = [
  "欧阳","司马","诸葛","上官","东方","南宫","西门","北冥","令狐","慕容","司徒","司空","夏侯","宇文","皇甫","公孙","轩辕","长孙","尉迟","公冶","端木","百里","呼延","独孤","申屠","闻人","澹台","公羊","羊舌","仲孙","太史",
];

// ✅ 门派辈分字（大量扩充版）
const GENERATION_CHARS = [
  "玄","清","云","凌","霄","太","虚","无","道","真","元","灵","妙","丹","剑","符","阵","器","雷","火","冰","风","木","金","水","土",
  "星","月","日","辰","曜","晟","昊","晗","晔","曦","昭","明","晖","皓","朗","璟","景","煜","焱","炎","烬","烁","灼","熙",
  "青","苍","碧","紫","赤","墨","白","霜","雪","霖","霁","澜","涛","渊","泉","川","海","沧","泓","澈","湛","潇","渺","澄",
  "岚","峦","岳","嵩","巍","岩","峻","峰","崇","阙","霆","雾","霭","霞","虹",
  "阳","阴","乾","坤","离","坎","震","巽","艮","兑",
  "梵","禅","释","慧","慈","净","寂","空",
  "天","地","人","心","意","念","神","魂","魄","命","运","缘",
  "刃","锋","芒","影","光","焰",
  "夜","晓","晨","暮","夕",
  "鸿","鹏","鹤","鸾","麟","龙","凤","虎","狼","鲲",
  "承","守","继","传","启","开","成","立","正","定","安","宁",
  "修","悟","炼","证","行","止","观","问","知","觉",
  "玉","瑶","琼","璇","璟","瑾","琳","玥","珞","珺","琰","琬","瑗","瑛",
  "墨","砚","书","画","琴","棋","诗","酒","茶","香",
  "封","镇","伏","破","斩","灭","御","摄","引","驭","化","归",
];

// ✅ 名字用字：第一字（飘逸/仙气）
const GIVEN_A = [
  "青","云","风","月","星","霜","雪","雨","烟","岚","澜","渊","川","海","沧","澈","泠","汐","沐","澄",
  "玄","清","太","虚","无","真","灵","妙","元","道","梵","禅","净","寂",
  "长","远","寒","夜","晓","晨","暮","夕","孤","临","御","破","斩","封","镇","摄","引","驭",
  "玉","瑶","琼","璇","瑾","琳","玥","珞","琰","瑛","璟","珺",
  "洛","宁","景","温","沈","苏","顾","白","秦","楚","萧","叶",
  "逸","尘","凌","霄","霆","耀","曜","晟","晔","曦","昭","明","朗","皓","煜","焱",
  "霖","霁","岑","峻","峰","巍","岳","嵩","阙","岩",
  "墨","砚","书","画","琴","棋","诗","酒","茶","香",
  "苍","碧","紫","赤","白","青",
];

// ✅ 名字用字：第二字（主角/招式感）
const GIVEN_B = [
  "尘","然","歌","行","舟","影","翎","鸿","鹤","鸾","龙","凰","麟","虎","狼","鲲",
  "离","归","渡","问","听","看","知","觉","悟","炼","证","修",
  "曜","耀","晟","晔","曦","昭","明","朗","皓","璟","景","煜","焱","炎","烬",
  "寒","霜","雪","雨","风","月","星","辰","岚","烟","霞","虹","霁","霖",
  "澜","渊","澈","湛","潇","渺","澄","沐","汐","泠","川","海",
  "剑","刀","枪","戟","弓","锋","刃","芒","影","光","焰","雷","霆",
  "安","宁","若","清","雅","言","轩","宸","辰","衡","衍","珩","瑾","琳","玥",
  "策","铭","承","守","继","传","启","开","成","立","正","定",
  "霄","天","地","人","心","意","念","神","魂","魄",
];

// ✅ 炫酷称号库（大量扩充版）
const TITLES = [
  "青冥剑主","太虚真人","玄天道君","紫霄上人","凌霄散仙","沧海剑仙","九霄剑尊","万剑归宗者","一念破虚","踏月行者",
  "寒江钓月","孤鸿照影","青衫客","白衣渡江","竹影听风","月下行舟","雪夜归人","流云逐鹤","风过无痕","云间访道",
  "天命主宰","万界行走","诸天客卿","星河执棋","苍穹镇守","寰宇巡狩","不朽战尊","无上道尊","万法归一","一剑开天",
  "十方皆敌","破界之刃","斩因果者","断轮回者","镇山河者","踏碎星河","诸邪退散","万灵俯首","九天之怒","天地同寿",
  "一剑霜寒","剑心通明","剑啸九霄","万剑朝宗","剑指山河","剑镇八荒","飞剑凌云","藏锋于鞘","惊鸿一剑","断水一剑",
  "符道宗师","阵道天工","万符归藏","天罡阵主","地煞符君","雷法真传","火法道子","冰魄灵尊","御风行者","驭雷天师",
  "炼器圣手","丹道宗匠","药王传人","禁制破译者","洞天开拓者","灵纹刻师","星盘执掌","五行掌灯","八卦司命",
  "幽冥使者","黄泉引路","冥河摆渡","万魂幡主","噬魂魔君","血海修罗","夜行阎罗","影域之主","黑炎灾厄","深渊回响",
  "天涯浪客","江湖旧梦","一壶浊酒","快意恩仇","仗剑天涯","踏雪无痕","风尘一骑","孤城夜雨","烟雨行舟","长街问剑",
  "宗门护法","首席真传","内门执事","外门长老","执法堂主","炼丹堂主","器阁掌印","阵阁首座","掌门亲传","护道者",
  "诸天第一狠人","渡劫专业户","天雷老熟人","灵石收割机","副本清道夫","秘境扫地僧","反派克星","BOSS终结者","剧情粉碎者","因果清算人",
  "上仙","真君","道君","道尊","仙尊","剑尊","魔君","尊上","少主","宗主","峰主","掌门","护法","长老","供奉","行走","客卿",
];

type TitleFormat = "prefix" | "suffix" | "brackets";
type GenerationMode = "off" | "random" | "fixed";
type TitleMode = "off" | "random" | "fixed";

type GeneratedItem = {
  name: string;       // 纯姓名
  titled?: string;    // 带称号展示
  title?: string;     // 称号
  genChar?: string;   // 辈分字
};

function genSurname() {
  const useDouble = Math.random() < 0.12;
  return useDouble ? pick(SURNAMES_DOUBLE) : pick(SURNAMES_SINGLE);
}

function buildTitled(name: string, title: string, fmt: TitleFormat) {
  if (fmt === "brackets") return `【${title}】${name}`;
  if (fmt === "prefix") return `${title}·${name}`;
  return `${name}·${title}`; // suffix
}

function genNameCore(len: NameLen, genMode: GenerationMode, fixedGen: string) {
  const surname = genSurname();

  const useGen = genMode !== "off";
  const genChar =
    genMode === "fixed" && fixedGen.trim()
      ? fixedGen.trim()
      : useGen
        ? pick(GENERATION_CHARS)
        : "";

  // 2字名：姓 + 1字名
  // 3字名：姓 + 2字名（或 姓+辈分+名）
  if (len === 2) {
    if (useGen) {
      // ✅ 你原逻辑：开辈分字会升级为3字更合理
      const b = pick(GIVEN_B);
      return { name: `${surname}${genChar}${b}`, genChar };
    }
    const one = pick(GIVEN_B);
    return { name: `${surname}${one}`, genChar: "" };
  }

  // len === 3
  if (useGen) {
    const b = pick(GIVEN_B);
    return { name: `${surname}${genChar}${b}`, genChar };
  }

  const a = pick(GIVEN_A);
  const b = pick(GIVEN_B);
  return { name: `${surname}${a}${b}`, genChar: "" };
}

function genOne(
  len: NameLen,
  genMode: GenerationMode,
  fixedGen: string,
  titleMode: TitleMode,
  fixedTitle: string,
  titleFmt: TitleFormat
): GeneratedItem {
  const core = genNameCore(len, genMode, fixedGen);

  if (titleMode === "off") return { name: core.name, genChar: core.genChar || "" };

  const title =
    titleMode === "fixed" && fixedTitle.trim()
      ? fixedTitle.trim()
      : pick(TITLES);

  const titled = buildTitled(core.name, title, titleFmt);
  return { name: core.name, titled, title, genChar: core.genChar || "" };
}

export default function EasternGeneratorClient() {
  const [len, setLen] = useState<NameLen>(3);

  // 辈分字：off / random / fixed
  const [genMode, setGenMode] = useState<GenerationMode>("random");
  const [fixedGen, setFixedGen] = useState<string>("玄");

  // 称号：off / random / fixed
  const [titleMode, setTitleMode] = useState<TitleMode>("random");
  const [fixedTitle, setFixedTitle] = useState<string>("青冥剑主");
  const [titleFmt, setTitleFmt] = useState<TitleFormat>("brackets");

  const [count, setCount] = useState(12);


// -----------------------------
// ✅ Name quality: short-term de-duplication
// -----------------------------
// Avoid repeating names/titled names across consecutive generations (per page session).
const RECENT_MAX = 300;
const recentListRef = useRef<string[]>([]);
const recentSetRef = useRef<Set<string>>(new Set());

function remember(keys: string[]) {
  for (const k of keys) {
    if (recentSetRef.current.has(k)) continue;
    recentSetRef.current.add(k);
    recentListRef.current.push(k);
    while (recentListRef.current.length > RECENT_MAX) {
      const old = recentListRef.current.shift();
      if (old) recentSetRef.current.delete(old);
    }
  }
}

function generateBatch(target: number) {
  const list: GeneratedItem[] = [];
  const seen = new Set<string>();
  const keysRemember: string[] = [];

  const maxAttempts = target * 60;
  let attempts = 0;

  while (list.length < target && attempts < maxAttempts) {
    attempts += 1;
    const it = genOne(len, genMode, fixedGen, titleMode, fixedTitle, titleFmt);
    const key = it.titled ?? it.name;
    if (seen.has(key)) continue;
    if (recentSetRef.current.has(key)) continue;
    seen.add(key);
    list.push(it);
    keysRemember.push(key);
  }

  // Fallback: allow repeats across sessions if pool is too small, but still unique within batch
  while (list.length < target) {
    const it = genOne(len, genMode, fixedGen, titleMode, fixedTitle, titleFmt);
    const key = it.titled ?? it.name;
    if (seen.has(key)) continue;
    seen.add(key);
    list.push(it);
    keysRemember.push(key);
  }

  remember(keysRemember);
  return list;
}


  const [items, setItems] = useState<GeneratedItem[]>(() => {
  const target = 12;
  const list: GeneratedItem[] = [];
  const seen = new Set<string>();
  const keysRemember: string[] = [];

  const maxAttempts = target * 60;
  let attempts = 0;

  while (list.length < target && attempts < maxAttempts) {
    attempts += 1;
    const it = genOne(3, "random", "玄", "random", "青冥剑主", "brackets");
    const key = it.titled ?? it.name;
    if (seen.has(key)) continue;
    if (recentSetRef.current.has(key)) continue;
    seen.add(key);
    list.push(it);
    keysRemember.push(key);
  }

  while (list.length < target) {
    const it = genOne(3, "random", "玄", "random", "青冥剑主", "brackets");
    const key = it.titled ?? it.name;
    if (seen.has(key)) continue;
    seen.add(key);
    list.push(it);
    keysRemember.push(key);
  }

  remember(keysRemember);
  return list;
});

  const plainCopy = useMemo(() => items.map((x) => x.name).join("\n"), [items]);
  const titledCopy = useMemo(
    () => items.map((x) => x.titled ?? x.name).join("\n"),
    [items]
  );

  function generate() {
    const target = Math.max(5, Math.min(30, count));
    setItems(generateBatch(target));
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  const showGenFixed = genMode === "fixed";
  const showTitleFixed = titleMode === "fixed";
  const useTitle = titleMode !== "off";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        {/* 长度 */}
        <div className="space-y-1">
          <div className="text-xs text-zinc-600">名字字数</div>
          <div className="flex gap-2">
            <button
              className={`rounded-xl border px-3 py-2 text-sm shadow-sm hover:shadow ${
                len === 2 ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white"
              }`}
              onClick={() => setLen(2)}
              type="button"
            >
              2字
            </button>
            <button
              className={`rounded-xl border px-3 py-2 text-sm shadow-sm hover:shadow ${
                len === 3 ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white"
              }`}
              onClick={() => setLen(3)}
              type="button"
            >
              3字
            </button>
          </div>

          {len === 2 && genMode !== "off" && (
            <div className="text-xs text-amber-700">
              已开启辈分字：2字会自动升级为更合理的3字（姓+辈分+名）。
            </div>
          )}
        </div>

        {/* 数量 */}
        <div className="space-y-1">
          <div className="text-xs text-zinc-600">一次生成</div>
          <input
            className="w-28 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
            type="number"
            min={5}
            max={30}
            value={count}
            onChange={(e) => setCount(Number(e.target.value || 10))}
          />
        </div>

        {/* 辈分字模式 */}
        <div className="space-y-1">
          <div className="text-xs text-zinc-600">门派辈分字</div>
          <select
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm"
            value={genMode}
            onChange={(e) => setGenMode(e.target.value as GenerationMode)}
          >
            <option value="off">关闭</option>
            <option value="random">随机</option>
            <option value="fixed">固定</option>
          </select>
        </div>

        {showGenFixed && (
          <div className="space-y-1">
            <div className="text-xs text-zinc-600">固定辈分字</div>
            <select
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm"
              value={fixedGen}
              onChange={(e) => setFixedGen(e.target.value)}
            >
              {GENERATION_CHARS.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 称号模式 */}
        <div className="space-y-1">
          <div className="text-xs text-zinc-600">炫酷称号</div>
          <select
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm"
            value={titleMode}
            onChange={(e) => setTitleMode(e.target.value as TitleMode)}
          >
            <option value="off">关闭</option>
            <option value="random">随机</option>
            <option value="fixed">固定</option>
          </select>
        </div>

        {useTitle && (
          <div className="space-y-1">
            <div className="text-xs text-zinc-600">称号格式</div>
            <select
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm"
              value={titleFmt}
              onChange={(e) => setTitleFmt(e.target.value as TitleFormat)}
            >
              <option value="brackets">【称号】姓名</option>
              <option value="prefix">称号·姓名</option>
              <option value="suffix">姓名·称号</option>
            </select>
          </div>
        )}

        {showTitleFixed && (
          <div className="space-y-1">
            <div className="text-xs text-zinc-600">固定称号</div>
            <select
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm max-w-[220px]"
              value={fixedTitle}
              onChange={(e) => setFixedTitle(e.target.value)}
            >
              {TITLES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
            onClick={generate}
            type="button"
          >
            生成
          </button>

          <button
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm hover:bg-zinc-50"
            onClick={() => copy(plainCopy)}
            type="button"
          >
            复制姓名
          </button>

          <button
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm hover:bg-zinc-50"
            onClick={() => copy(titledCopy)}
            disabled={!useTitle}
            title={!useTitle ? "开启称号后可复制称号版" : ""}
            type="button"
          >
            复制称号版
          </button>
        </div>
      </div>

      {/* 输出 */}
      <div className="grid gap-2">
        {items.map((x, idx) => (
          <div key={`${x.name}-${idx}`} className="rounded-xl bg-zinc-50 px-3 py-2">
            <div className="font-medium text-zinc-900">{x.titled ?? x.name}</div>
            <div className="text-xs text-zinc-600 mt-1">
              {x.title ? (
                <>
                  姓名：{x.name} · 辈分字：{x.genChar || "—"} · 称号：{x.title}
                </>
              ) : (
                <>姓名：{x.name} · 辈分字：{x.genChar || "—"}</>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SEO 小提示（页面可留，别放 /en 首页） */}
      <div className="text-xs text-zinc-500">
        English keywords: xianxia name generator / wuxia name generator / chinese fantasy name generator
      </div>
    </div>
  );
}
