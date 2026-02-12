package com.example.demo.controller;

import com.example.demo.entity.Food; // Food.javaがある場所
import com.example.demo.repository.FoodRepository; // ここがくっついていないか確認
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodRepository foodRepository; // 修正ポイント：FoodRepository(型) と foodRepository(名前)

    @GetMapping("/gacha")
    public Food getGacha(
            @RequestParam(required = false) Integer heaviness,
            @RequestParam(required = false) String sourceType
    ) {
        List<Food> allFoods;

        // 条件に合わせて「リスト」で取得する
        if (heaviness != null && sourceType != null) {
            allFoods = foodRepository.findByHeavinessAndSourceType(heaviness, sourceType);
        } else if (heaviness != null) {
            allFoods = foodRepository.findByHeaviness(heaviness);
        } else if (sourceType != null) {
            allFoods = foodRepository.findBySourceType(sourceType);
        } else {
            allFoods = foodRepository.findAll();
        }

        // リストが空ならnullを返す
        if (allFoods == null || allFoods.isEmpty()) {
            return null;
        }

        // 【重要】ここで中身をシャッフルして「ランダム」にする
        Collections.shuffle(allFoods);
        return allFoods.get(0);
    }
}