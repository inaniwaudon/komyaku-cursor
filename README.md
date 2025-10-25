# komyaku-cursor

大阪・関西万博のデザインエレメント ID である「[こみゃく](https://expoworlds.jp/ja/visual/)」をベースにしたマウスカーソルです．
Google Chrome 用拡張機能として動作します．
PC 環境にて，マウスまたはトラックパッドでの使用を前提としています．

拡張機能をインストールせずとも，以下のデモページから試すこともできます．

<https://inaniwaudon.github.io/komyaku-cursor>

## 使い方

- ページ上にマウスカーソルの代わりにこみゃくが出現します．
- こみゃくは，興味のある要素（こみゃくに最も近接した要素）の方向を常に見ています．
  要素内外に関わらず，クリックするとその要素を選択します．
- 密集するターゲット群にこみゃくが迷い込んだ場合，こみゃくがターゲットすべてに分散します．
  この場合，マウス（または）を横に移動することで選択します．
- マウスまたはトラックパッドを押し込みながらカーソルを移動させると，こみゃくが連なって現れます．
  押し込みを解除すると，隣接する要素が選択されます．

## 使い方

1. [Releases](https://github.com/inaniwaudon/komyaku-cursor/releases) から最新のパッケージを取得します．
2. [chrome://extensions](chrome://extensions) にアクセスして，デベロッパーモードを有効にします．
3. `crx-komyaku-cursor-x.x.x.zip` を画面にドラッグアンドドロップします．

## 開発

```
# ファイルを変更した際に自動ビルド
yarn run dev

# /release 配下にパッケージ化された zip ファイルを生成
yarn run build
```

## 備考

本拡張機能は[大阪・関西万博の二次創作ガイドライン](https://www.expo2025.or.jp/wp/wp-content/themes/expo2025orjp_2022/assets/pdf/character/character_terms.pdf)に従って公開されています．

また，本拡張機能は，以下の先行研究から着想を得たものです．

- T. Grossman, et al. The Bubble Cursor: Enhancing Target Acquisition by Dynamic Resizing of the Cursor's Activation Area. CHI '05. pp. 281–290. <https://doi.org/10.1145/1054972.105501>
- M. E. Mott, et al. Beating the Bubble: Using Kinematic Triggering in the Bubble Lens for Acquiring Small, Dense Targets. CHI '14. pp. 733–742. <https://doi.org/10.1145/2556288.2557410>
- O. K. Au, et al. LinearDragger: a Linear Selector for One-finger Target Acquisition. CHI '14. pp. 2607–2616. <https://dl.acm.org/doi/10.1145/2556288.2557096>
