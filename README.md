# ロジカル・カジノ（ロジカル・ダイス・ポーカー）

1〜10のカードに「地雷」を2枚隠し、ルーレットの効果と推理で相手の地雷を先に2枚とも当てたほうが勝ちの対戦ゲーム。

- 公開版（GitHub Pages）: https://yangxiangyangxiang468-tech.github.io/Logic-Duel/ （下の手順で有効にしたあと）
- 公開版（claude.ai）: https://claude.ai/artifact/MbUPPjNBkTzVYDuzZGasBC
- `index.html` 1ファイルで完結（ビルド不要）

## 遊び方

- **CPU対戦**: `index.html` をブラウザで開けばそのまま遊べる
- **オンライン対戦**: アカウント不要。片方が「部屋を作る」で4文字のコードを出し、もう片方が同じページでそのコードを入力して「参加する」
  - ブラウザ同士の直接通信（WebRTC）。接続の仲介に [PeerJS](https://peerjs.com/) の無料サーバーを使う
  - 部屋を作った人のブラウザが進行役になる。その人がページを閉じると部屋はなくなる（参加した人は同じコードで再参加できる）
  - 学校や会社のネットワークなど、直接通信を禁止している環境ではつながらないことがある
  - claude.ai の公開版ではページの通信制限によりオンライン対戦が動かないことがあるので、GitHub Pages 版を使う

## GitHub Pages の有効化

1. GitHub でこのリポジトリの **Settings → Pages** を開く
2. **Source** を「Deploy from a branch」、**Branch** を `main` / `/ (root)` にして保存
3. 数分後に `https://yangxiangyangxiang468-tech.github.io/Logic-Duel/` で開ける（無料プランではリポジトリが Public である必要がある）

## 構成（index.html 内）

- ゲームエンジン: `act()` が状態とアクションを受け取り、新しい状態を返す純粋関数
- 推理アシスト: `solve()` が公開情報と矛盾しない地雷の組み合わせ（最大45通り）を全列挙し、各数字の確率を出す。切り札使用後は入れ替え前後の全パターンを合成
- CPU: `cpuDecide()` が `solve()` の結果をもとに行動を選ぶ
- オンライン: 進行役（部屋を作った側）だけが `act()` を実行し、参加側は操作を送って結果の状態を受け取る。参加側に送る状態からは、決着まで進行役の地雷・おとり・切り札の中身を伏せる（`viewForGuest()`）
