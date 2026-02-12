package com.example.demo;

import com.example.demo.entity.Food;
import com.example.demo.repository.FoodRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final FoodRepository foodRepository;

    // ここを修正！ クラス名と同じ「DataInitializer」にする必要があります
    public DataInitializer(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    @Override
    public void run(String... args) {
        if (foodRepository.count() == 0) {
            // 第5引数が説明文、第6引数がレシピURL
            saveFood("冷やしうどん", "和食", 1, "COOKING", "コシのある麺をさっぱり。夏に最高。", "https://www.kikkoman.co.jp/homecook/theme/popular/hiyashiudon.html");
            saveFood("春雨スープ", "スープ", 1, "CONVENIENCE", "低カロリーでヘルシー。夜食にも。", null);
            saveFood("ざるそば", "和食", 1, "EAT_OUT", "江戸前風の濃いめつゆで、喉越しを楽しむ粋な一杯。", null);
            saveFood("親子丼", "和食", 3, "COOKING", "ふわとろ卵と出汁。どんぶりの王道。", "https://delishkitchen.tv/recipes/197038485394162815");
            saveFood("醤油ラーメン", "ラーメン", 3, "EAT_OUT", "昔ながらの中華そば。透き通ったスープが落ち着く。", null);
            saveFood("カツカレー", "カレー", 5, "COOKING", "サクサクのカツと濃厚ルー。ご褒美に。", "https://delishkitchen.tv/recipes/184129806885979263");
            saveFood("とんこつラーメン", "ラーメン", 5, "EAT_OUT", "濃厚スープが極細麺に絡む。替え玉必至の一杯。", null);


            // 和食
            saveFood("生姜焼き", "和食", 4, "ご飯がすすむ定番のおかず。", "COOKING", "https://delishkitchen.tv/recipes/197328869693326368");
            saveFood("寿司", "和食", 2, "たまには贅沢に。テイクアウトもアリ。", "EAT_OUT", null);

            // 洋食
            saveFood("オムライス", "洋食", 3, "ふわとろ卵の絶品オムライス。", "COOKING", "https://delishkitchen.tv/recipes/136626092508184845");
            saveFood("ハンバーグ", "洋食", 5, "肉汁あふれるジューシーな一品。", "EAT_OUT", null);
            saveFood("カルボナーラ", "洋食", 4, "クリーミーなソースがパスタに絡む。", "COOKING", "https://delishkitchen.tv/recipes/173697380598677996");

            // 中華・その他
            saveFood("麻婆豆腐", "中華", 4, "ピリ辛でご飯が止まらない！", "COOKING", "https://www.kurashiru.com/recipes/90f0de6f-cf9a-4a1b-9491-750f4100c996");
            saveFood("餃子", "中華", 4, "パリッと焼けた皮とジューシーな餡。", "CONVENIENCE", null);
            saveFood("ビビンバ", "韓国料理", 3, "野菜たっぷりでヘルシーかつ満足感。 ", "EAT_OUT", null);

            // コンビニ・手軽なもの
            saveFood("サンドイッチ", "軽食", 1, "時間がない時でもさっと食べられる。", "CONVENIENCE", null);
            saveFood("シーフードヌードル", "麺類", 3, "困った時のカップ麺。お湯を入れるだけ。", "CONVENIENCE", null);

            System.out.println("★ URL・説明文付きデータの登録が完了しました！");
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