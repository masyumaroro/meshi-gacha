package com.example.demo.repository;

import com.example.demo.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List; // これが必要

public interface FoodRepository extends JpaRepository<Food, Long> {
    // 戻り値を Food ではなく List<Food> にするのがポイント
    List<Food> findByHeaviness(int heaviness);
    List<Food> findBySourceType(String sourceType);
    List<Food> findByHeavinessAndSourceType(int heaviness, String sourceType);
}