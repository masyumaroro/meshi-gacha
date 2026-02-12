package com.example.demo.controller;

import com.example.demo.entity.Food;
import com.example.demo.repository.FoodRepository;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodController {

    private final FoodRepository foodRepository;

    public FoodController(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

   @GetMapping("/gacha")
    public Food getGacha(
    @RequestParam(required = false) Integer heaviness, // required = false で「選ばなくてもOK」に
    @RequestParam(required = false) String sourceType
    ) {
    List<Food> allFoods;
    // 条件に合わせて検索（条件がない場合は全件取得）
    if (heaviness != null && sourceType != null) {
        allFoods = repository.findByHeavinessAndSourceType(heaviness, sourceType);
    } else if (heaviness != null) {
        allFoods = repository.findByHeaviness(heaviness);
    } else if (sourceType != null) {
        allFoods = repository.findBySourceType(sourceType);
    } else {
        allFoods = repository.findAll();
    }

    if (allFoods.isEmpty()) {
        return null; // またはエラー用のFoodオブジェクト
    }

    // 【重要】リストをシャッフルして、その中の「0番目」を返すことでランダムにする！
    Collections.shuffle(allFoods);
    return allFoods.get(0);
}

}