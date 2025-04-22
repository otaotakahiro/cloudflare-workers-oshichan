import { AoiService } from './infrastructures/sites/aoi/aoi.service.js';
import fs from 'fs';
import path from 'path';

// テストケース1: 才能溢れる狼（男性）のmain-contents取得テスト
async function testCase1() {
  console.log('テストケース1: 才能溢れる狼（男性）のmain-contents取得テスト');
  const aoiService = new AoiService('才能溢れる狼', 'man');
  try {
    const content = await getContent(aoiService);
    // main-contentsクラスが含まれているか確認
    if (!content.includes('main-contents')) {
      console.error('Warning: main-contentsクラスが見つかりませんでした');
    }
    console.log('取得したコンテンツ（先頭100文字）:', content.substring(0, 100));
    
    // コンテンツをファイルに保存
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(path.join(outputDir, 'creative_ookami_man.txt'), content);
    console.log('コンテンツをファイルに保存しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// テストケース2: 勤勉なこじか（女性）のmain-contents取得テスト
async function testCase2() {
  console.log('\nテストケース2: 勤勉なこじか（女性）のmain-contents取得テスト');
  const aoiService = new AoiService('勤勉なこじか', 'woman');
  try {
    const content = await getContent(aoiService);
    // main-contentsクラスが含まれているか確認
    if (!content.includes('main-contents')) {
      console.error('Warning: main-contentsクラスが見つかりませんでした');
    }
    console.log('取得したコンテンツ（先頭100文字）:', content.substring(0, 100));
    
    // コンテンツをファイルに保存
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(path.join(outputDir, 'shikkari_kojika_woman.txt'), content);
    console.log('コンテンツをファイルに保存しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// テストケース3: 存在しないキャラクター
async function testCase3() {
  console.log('\nテストケース3: 存在しないキャラクター');
  try {
    const aoiService = new AoiService('存在しないキャラクター', 'man');
    const content = await getContent(aoiService);
    console.log('取得したコンテンツ:', content);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// テストを実行
async function runTests() {
  console.log('AoiService テスト開始');
  await testCase1();
  await testCase2();
  await testCase3();
  console.log('AoiService テスト終了');
}

async function getContent(service) {
  try {
    const content = await service.getContent();
    // 不要なテキストを除外
    const cleanContent = content
      .replace(/\(function\(d,.*?facebook-jssdk'\);/s, '') // Facebook SDKスクリプトを除去
      .replace(/window\.dataLayer.*?UA-146880341-1'\);/s, '') // Google Analyticsスクリプトを除去
      .replace(/\(function\(d\).*?}\)\(document\);/s, '') // コピー防止スクリプトを除去
      .replace(/トップページ.*?動物キャラ占い/s, '') // ナビゲーションメニューを除去
      .replace(/診断結果をシェアしよう！.*?pocket-btn-js"\);/gs, '') // シェアボタンを除去
      .replace(/最新記事一覧.*?用語集/s, '') // 最新記事一覧と関連リンクを除去
      .replace(/著者情報.*?$/s, '') // 著者情報以降を除去
      .trim();

    // マークダウン形式に変換
    const markdownContent = convertToMarkdown(cleanContent);
    return markdownContent;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// マークダウン形式に変換する関数
function convertToMarkdown(content) {
  return content
    // タイトルを#に変換
    .replace(/^動物キャラ占い-(.*?)$/gm, '# $1')
    // 主要な見出しを##に変換
    .replace(/^(性格・特徴|恋愛|結婚|仕事|金銭感覚|勤勉なこじかの取り扱い方|「勤勉なこじか」の自己改善アドバイス)$/gm, '## $1')
    // サブ見出しを###に変換
    .replace(/^(好きな人が勤勉なこじかの場合|あなたの恋人が勤勉なこじかの場合|あなたの妻が勤勉なこじかの場合|あなたの上司が勤勉なこじかの場合|あなたの同僚が勤勉なこじかの場合)$/gm, '### $1')
    // 改善策の見出しを####に変換
    .replace(/^改善策：$/gm, '#### 改善策')
    // リスト項目をマークダウンリストに変換
    .replace(/^\d+\./gm, '-')
    // 強調テキストを**で囲む
    .replace(/\*\*(.*?)\*\*/g, '**$1**')
    // コードブロックを```で囲む
    .replace(/```(.*?)```/gs, '```\n$1\n```');
}

runTests(); 