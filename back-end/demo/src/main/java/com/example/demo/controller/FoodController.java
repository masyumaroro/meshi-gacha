package com.example.demo.controller;

import com.example.demo.entity.Food;
import com.example.demo.foodRepository.FoodfoodRepository;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodController {

    private final FoodfoodRepository foodfoodRepository;

    public FoodController(FoodfoodRepository foodfoodRepository) {
        this.foodfoodRepository = foodfoodRepository;
    }

   @GetMapping("/gacha")
    public Food getGacha(
    @RequestParam(required = false) Integer heaviness, // required = false で「選ばなくてもOK」に
    @RequestParam(required = false) String sourceType
    ) {
    List<Food> allFoods;
    // 条件に合わせて検索（条件がない場合は全件取得）
    if (heaviness != null && sourceType != null) {
        allFoods = foodRepository.findByHeavinessAndSourceType(heaviness, sourceType);
    } else if (heaviness != null) {
        allFoods = foodRepository.findByHeaviness(heaviness);
    } else if (sourceType != null) {
        allFoods = foodRepository.findBySourceType(sourceType);
    } else {
        allFoods = foodRepository.findAll();
    }

    if (allFoods.isEmpty()) {
        return null; // またはエラー用のFoodオブジェクト
    }

    // 【重要】リストをシャッフルして、その中の「0番目」を返すことでランダムにする！
    Collections.shuffle(allFoods);
    return allFoods.get(0);
}

}