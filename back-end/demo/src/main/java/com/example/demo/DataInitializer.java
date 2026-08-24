package com.example.demo;

import com.example.demo.entity.Food;
import com.example.demo.repository.FoodRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final FoodRepository foodRepository;

    public DataInitializer(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    @Override
    public void run(String... args) {
        if (foodRepository.count() == 0) {
            // あっさり (1)
            saveFood("冷やしうどん",       "和食",     1, "COOKING",      "コシのある麺をさっぱり。夏に最高。",                 "https://www.kikkoman.co.jp/homecook/theme/popular/hiyashiudon.html");
            saveFood("ざるそば",           "和食",     1, "EAT_OUT",      "江戸前風の濃いめつゆで、喉越しを楽しむ粋な一杯。",   null);
            saveFood("そうめん",           "和食",     1, "COOKING",      "細くてつるっと。夏の定番。薬味たっぷりで。",          "https://www.kikkoman.co.jp/homecook/theme/popular/soumen.html");
            saveFood("お茶漬け",           "和食",     1, "COOKING",      "サラサラっと食べられる。夜食にもぴったり。",          null);
            saveFood("冷ややっこ",         "和食",     1, "COOKING",      "ひんやり豆腐にしょうゆとねぎ。最高のシンプルさ。",    null);
            saveFood("春雨スープ",         "スープ",   1, "CONVENIENCE",  "低カロリーでヘルシー。夜食にも。",                   null);
            saveFood("サンドイッチ",       "軽食",     1, "CONVENIENCE",  "時間がない時でもさっと食べられる。",                  null);
            saveFood("サラダチキン",       "軽食",     1, "CONVENIENCE",  "高タンパク低カロリー。コンビニの優秀食材。",           null);
            saveFood("カップスープ",       "スープ",   1, "CONVENIENCE",  "お湯を注ぐだけ。身体があたたまる。",                  null);

            // やや軽め (2)
            saveFood("寿司",              "和食",     2, "EAT_OUT",      "たまには贅沢に。テイクアウトもアリ。",                null);
            saveFood("冷しゃぶ",          "和食",     2, "COOKING",      "さっぱりポン酢でいただく。夏の主役。",                "https://www.kikkoman.co.jp/homecook/search/recipe/00003461/index.html");
            saveFood("茶碗蒸し",          "和食",     2, "EAT_OUT",      "なめらかな食感とやさしいだしの香り。",                null);
            saveFood("おにぎり",          "軽食",     2, "CONVENIENCE",  "具材で選ぶ楽しさも。手軽なのに満足感あり。",          null);
            saveFood("鮭定食",            "和食",     2, "EAT_OUT",      "焼き鮭と白ご飯の黄金コンビ。",                       null);
            saveFood("うどん",            "和食",     2, "EAT_OUT",      "もちもち麺とやさしいだし。ほっとする味。",            null);

            // 普通 (3)
            saveFood("親子丼",            "和食",     3, "COOKING",      "ふわとろ卵と出汁。どんぶりの王道。",                  "https://delishkitchen.tv/recipes/197038485394162815");
            saveFood("醤油ラーメン",      "ラーメン", 3, "EAT_OUT",      "昔ながらの中華そば。透き通ったスープが落ち着く。",    null);
            saveFood("オムライス",        "洋食",     3, "COOKING",      "ふわとろ卵の絶品オムライス。",                        "https://delishkitchen.tv/recipes/136626092508184845");
            saveFood("ビビンバ",          "韓国料理", 3, "EAT_OUT",      "野菜たっぷりでヘルシーかつ満足感。",                  null);
            saveFood("シーフードヌードル","麺類",     3, "CONVENIENCE",  "困った時のカップ麺。お湯を入れるだけ。",              null);
            saveFood("チャーハン",        "中華",     3, "EAT_OUT",      "パラパラ炒飯。シンプルなのに飽きない味。",            null);
            saveFood("ナポリタン",        "洋食",     3, "COOKING",      "ケチャップの甘酸っぱさが懐かしい。",                  "https://www.kikkoman.co.jp/homecook/search/recipe/00002743/index.html");
            saveFood("肉じゃが",          "和食",     3, "COOKING",      "ほっくりじゃがいもと甘辛い煮汁。おふくろの味。",      "https://www.kikkoman.co.jp/homecook/search/recipe/00003034/index.html");
            saveFood("唐揚げ定食",        "和食",     3, "EAT_OUT",      "ジューシーな揚げたて。ご飯が進む。",                  null);
            saveFood("たこ焼き",          "軽食",     3, "EAT_OUT",      "外はカリ、中はとろり。ソースとマヨが最高。",          null);
            saveFood("カレーライス",      "カレー",   3, "COOKING",      "スパイスが食欲をそそる。定番の家カレー。",            "https://delishkitchen.tv/recipes/154777327985475750");

            // やや重め (4)
            saveFood("生姜焼き",          "和食",     4, "COOKING",      "ご飯がすすむ定番のおかず。",                          "https://delishkitchen.tv/recipes/197328869693326368");
            saveFood("カルボナーラ",      "洋食",     4, "COOKING",      "クリーミーなソースがパスタに絡む。",                  "https://delishkitchen.tv/recipes/173697380598677996");
            saveFood("麻婆豆腐",          "中華",     4, "COOKING",      "ピリ辛でご飯が止まらない！",                          "https://www.kurashiru.com/recipes/90f0de6f-cf9a-4a1b-9491-750f4100c996");
            saveFood("餃子",              "中華",     4, "CONVENIENCE",  "パリッと焼けた皮とジューシーな餡。",                  null);
            saveFood("牛丼",              "和食",     4, "EAT_OUT",      "甘辛い牛肉と玉ねぎ。丼の王様。",                      null);
            saveFood("カツ丼",            "和食",     4, "EAT_OUT",      "サクサクカツと甘いだし。ガッツリ食べたい日に。",      null);
            saveFood("焼肉",              "焼肉",     4, "EAT_OUT",      "本能に訴える炭火の香り。今日は肉の日。",              null);
            saveFood("ピザ",              "洋食",     4, "EAT_OUT",      "もちもちの生地にチーズたっぷり。",                    null);
            saveFood("チーズバーガー",    "洋食",     4, "EAT_OUT",      "肉汁とチーズが口の中で合わさる瞬間。",                null);
            saveFood("天ぷらそば",        "和食",     4, "EAT_OUT",      "サクサク天ぷらと香るだし。",                          null);

            // こってり (5)
            saveFood("カツカレー",        "カレー",   5, "COOKING",      "サクサクのカツと濃厚ルー。ご褒美に。",                "https://delishkitchen.tv/recipes/184129806885979263");
            saveFood("とんこつラーメン",  "ラーメン", 5, "EAT_OUT",      "濃厚スープが極細麺に絡む。替え玉必至の一杯。",        null);
            saveFood("ハンバーグ",        "洋食",     5, "EAT_OUT",      "肉汁あふれるジューシーな一品。",                      null);
            saveFood("バターチキンカレー","カレー",   5, "COOKING",      "濃厚なトマトとバターのコク。スパイスが食欲全開に。",  "https://www.kikkoman.co.jp/homecook/search/recipe/00003803/index.html");
            saveFood("二郎系ラーメン",    "ラーメン", 5, "EAT_OUT",      "野菜マシマシ。ガッツリ食べたい日の最終兵器。",        null);
            saveFood("チーズタッカルビ",  "韓国料理", 5, "EAT_OUT",      "チーズと甘辛タレがとろける。鍋を囲む幸せ。",          null);
            saveFood("クリームシチュー",  "洋食",     5, "COOKING",      "とろりとしたホワイトソースに野菜がほっくり。",         "https://www.kikkoman.co.jp/homecook/search/recipe/00000673/index.html");
        }
    }

    private void saveFood(String name, String category, int heaviness, String sourceType, String description, String recipeUrl) {
        Food food = new Food();
        food.setName(name);
        food.setCategory(category);
        food.setHeaviness(heaviness);
        food.setSourceType(sourceType);
        food.setDescription(description);
        food.setRecipeUrl(recipeUrl);
        foodRepository.save(food);
    }
}
