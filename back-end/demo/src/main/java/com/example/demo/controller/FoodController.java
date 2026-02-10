package com.example.demo.controller;

import com.example.demo.entity.Food;
import com.example.demo.repository.FoodRepository;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodController {

    private final FoodRepository foodRepository;

    public FoodController(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    @GetMapping("/gacha")
    public Food getRandomFood(
            @RequestParam(required = false) Integer heaviness,
            @RequestParam(required = false) String sourceType
    ) {
        List<Food> allFoods = foodRepository.findAll();

        List<Food> filteredFoods = allFoods.stream()
            .filter(f -> heaviness == null || f.getHeaviness() == heaviness)
            .filter(f -> sourceType == null || f.getSourceType().equals(sourceType))
            .toList();

        if (filteredFoods.isEmpty()) {
            return null;
        }

        List<Food> mutableList = new ArrayList<>(filteredFoods);
        Collections.shuffle(mutableList);
        return mutableList.get(0);
    }
}