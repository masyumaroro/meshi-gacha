# 飯ガチャ

> 今日のご飯、迷ったら Java に聞け！

「何食べよう…」で 10 分溶かすのをやめるための、献立抽選アプリです。
気分（あっさり / こってり）と食事タイプ（自炊 / 外食 / コンビニ）をゆるく指定してボタンを押すと、条件に合う料理を 1 つランダムに提案します。自炊メニューにはレシピへのリンク付き。

- **フロントエンド**: React + TypeScript + Vite（PWA 対応）
- **バックエンド**: Spring Boot + Spring Data JPA + H2
- **API**: https://meshi-gacha.onrender.com

---

## 主な機能

| 機能 | 説明 |
| --- | --- |
| 条件フィルタ | 「あっさり / こってり」「自炊 / 外食 / コンビニ」を選択。**どちらも未選択でも OK**（全メニューから抽選） |
| トグル選択 | 選択済みのチップをもう一度押すと解除できます |
| ガチャ演出 | 抽選中はダミーの料理名が高速で切り替わり、約 1.2 秒後に結果が確定します |
| レシピリンク | 自炊メニュー（`COOKING`）にレシピ URL がある場合、「作り方を見る」ボタンを表示します |
| PWA | ホーム画面に追加してネイティブアプリのように使えます |

---

## 技術スタック

### フロントエンド（`front-end/frontend`）

- React 19 / TypeScript 5.9
- Vite 7
- Tailwind CSS v4（`@tailwindcss/vite`）
- Framer Motion（アニメーション）
- lucide-react（アイコン）
- vite-plugin-pwa（Service Worker / マニフェスト生成）

### バックエンド（`back-end/demo`）

- Java 17 / Spring Boot 4.0.2
- Spring Web MVC / Spring Data JPA
- H2 Database（インメモリ）
- Maven（Maven Wrapper 同梱）
- Docker（マルチステージビルド）

---

## 📁 ディレクトリ構成

```
meshi-gacha/
├── back-end/demo/
│   ├── src/main/java/com/example/demo/
│   │   ├── DemoApplication.java        # エントリポイント
│   │   ├── DataInitializer.java        # 起動時の初期メニュー投入
│   │   ├── entity/Food.java            # 料理エンティティ
│   │   ├── repository/FoodRepository.java
│   │   └── controller/FoodController.java
│   ├── src/main/resources/application.properties
│   ├── Dockerfile
│   └── pom.xml
└── front-end/frontend/
    ├── src/
    │   ├── App.tsx                     # 画面・ガチャロジック
    │   └── main.tsx
    ├── vite.config.ts                  # PWA 設定を含む
    └── package.json
```

---

## セットアップ

### 前提

- Java 17 以上
- Node.js 20 以上

### バックエンドの起動

```bash
cd back-end/demo
./mvnw spring-boot:run
```

`http://localhost:8080` で起動します。初回起動時に `DataInitializer` が初期メニューを自動投入します。

H2 はインメモリ構成のため、**アプリを再起動するとデータはリセットされます**。中身は H2 コンソール（`http://localhost:8080/h2-console`、JDBC URL: `jdbc:h2:mem:testdb`）から確認できます。

#### Docker で起動する場合

```bash
cd back-end/demo
docker build -t meshi-gacha-api .
docker run -p 8080:8080 meshi-gacha-api
```

### フロントエンドの起動

```bash
cd front-end/frontend
npm install
npm run dev
```

`http://localhost:5173` で起動します。

接続先 API は `src/App.tsx` の `API_BASE_URL` で指定しています。ローカルのバックエンドに向ける場合は以下のように書き換えてください。

```ts
const API_BASE_URL = "http://localhost:8080";
```

### その他のコマンド

```bash
npm run build     # 本番ビルド（型チェック + Vite build）
npm run preview   # ビルド結果のプレビュー
npm run lint      # ESLint
```

---

## API 仕様

### `GET /api/foods/gacha`

条件に合う料理をランダムに 1 件返します。

**クエリパラメータ**（すべて任意）

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| `heaviness` | Integer | 重さ。1（あっさり）〜 5（こってり） |
| `sourceType` | String | `COOKING`（自炊） / `EAT_OUT`（外食） / `CONVENIENCE`（コンビニ） |

パラメータを省略した場合は、その条件で絞り込みません。条件に合う料理が 1 件もない場合は空のレスポンスを返します。

**リクエスト例**

```
GET /api/foods/gacha?heaviness=5&sourceType=COOKING
```

**レスポンス例**

```json
{
  "id": 6,
  "name": "カツカレー",
  "category": "カレー",
  "heaviness": 5,
  "sourceType": "COOKING",
  "description": "サクサクのカツと濃厚ルー。ご褒美に。",
  "recipeUrl": "https://delishkitchen.tv/recipes/184129806885979263"
}
```

---

## 🍽 データモデル（`Food`）

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `id` | Long | 主キー（自動採番） |
| `name` | String | 料理名 |
| `category` | String | 和食 / 洋食 / 中華 など |
| `heaviness` | int | 重さ（1〜5） |
| `sourceType` | String | `COOKING` / `EAT_OUT` / `CONVENIENCE` |
| `description` | String | ひとこと説明 |
| `recipeUrl` | String | レシピ URL（無い場合は `null`） |

メニューを追加する場合は、`DataInitializer#run` に `saveFood(...)` の行を追記してください。

---

## 📝 今後の予定

- [ ] メニューの追加・編集 API（現状は初期データのみ）
- [ ] 永続化 DB への移行（H2 インメモリ → PostgreSQL など）
- [ ] CORS 設定を本番オリジンに限定（現状は `*` を許可）
- [ ] 抽選履歴の保存と「最近出た料理は出にくくする」重み付け
- [ ] `heaviness` の中間値（2〜4）を UI から選べるように
