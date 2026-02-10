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
            saveFood("冷やしうどん", "和食", 1, "COOKING", "コシのある麺をさっぱり。夏に最高。", "https://www.kurashiru.com/recipes/7d363574-e86d-498c-8438-2d8869853926");
            saveFood("春雨スープ", "スープ", 1, "CONVENIENCE", "低カロリーでヘルシー。夜食にも。", null);
            saveFood("ざるそば", "和食", 1, "EAT_OUT", "江戸前風の濃いめつゆで、喉越しを楽しむ粋な一杯。", null);
            saveFood("親子丼", "和食", 3, "COOKING", "ふわとろ卵と出汁。どんぶりの王道。", "https://cookpad.com/recipe/1500000");
            saveFood("醤油ラーメン", "ラーメン", 3, "EAT_OUT", "昔ながらの中華そば。透き通ったスープが落ち着く。", null);
            saveFood("カツカレー", "カレー", 5, "COOKING", "サクサクのカツと濃厚ルー。ご褒美に。", "https://www.kurashiru.com/recipes/77f7243c-396a-466d-a602-9442654c865f");
            saveFood("とんこつラーメン", "ラーメン", 5, "EAT_OUT", "濃厚スープが極細麺に絡む。替え玉必至の一杯。", null);

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