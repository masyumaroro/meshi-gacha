package com.example.demo.controller;

import com.example.demo.entity.Food;
import com.example.demo.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    @Autowired
    private FoodRepository foodRepository;

    @GetMapping("/gacha")
    public ResponseEntity<Food> getGacha(
            @RequestParam(required = false) Integer heavinessMin,
            @RequestParam(required = false) Integer heavinessMax,
            @RequestParam(required = false) String sourceType
    ) {
        boolean hasRange = heavinessMin != null || heavinessMax != null;
        int min = heavinessMin != null ? heavinessMin : 1;
        int max = heavinessMax != null ? heavinessMax : 5;

        List<Food> allFoods;
        if (hasRange && sourceType != null) {
            allFoods = foodRepository.findByHeavinessBetweenAndSourceType(min, max, sourceType);
        } else if (hasRange) {
            allFoods = foodRepository.findByHeavinessBetween(min, max);
        } else if (sourceType != null) {
            allFoods = foodRepository.findBySourceType(sourceType);
        } else {
            allFoods = foodRepository.findAll();
        }

        if (allFoods == null || allFoods.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Collections.shuffle(allFoods);
        return ResponseEntity.ok(allFoods.get(0));
    }
}
