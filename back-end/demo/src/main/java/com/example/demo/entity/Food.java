package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private int heaviness;
    private String sourceType;
    private String description; // 説明文
    private String recipeUrl;   // レシピURL

    // --- Getter & Setter (手動で定義) ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getHeaviness() { return heaviness; }
    public void setHeaviness(int heaviness) { this.heaviness = heaviness; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRecipeUrl() { return recipeUrl; }
    public void setRecipeUrl(String recipeUrl) { this.recipeUrl = recipeUrl; }
}