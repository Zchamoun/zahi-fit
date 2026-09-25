"use strict";
/* Zahi Fit v5.0 — built-in food list (works offline, free).
   Values are typical per-serving estimates from standard nutrition tables; users can adjust any entry when logging.
   [name, serving, kcal, protein g, carbs g, fat g, fiber g, tags]
   tags: meat, fish, veg (vegetarian), vegan, keto, med (Mediterranean), quick, combo */
const FOOD_ROWS = [
  // Quick-add combos (from the spec)
  ["Sandwich (chicken or turkey)", "1 sandwich", 450, 30, 45, 14, 4, "meat combo quick"],
  ["Bowl of rice + protein", "1 bowl", 650, 40, 75, 16, 3, "meat combo"],
  ["Coffee + pastry", "1 coffee + croissant", 380, 8, 40, 20, 2, "veg combo quick"],
  ["Pizza slice", "1 large slice", 290, 12, 34, 11, 2, "veg combo"],
  ["Eggs + toast", "2 eggs + 2 slices", 350, 18, 30, 16, 3, "veg combo quick"],
  ["Protein shake", "1 scoop in water", 130, 25, 4, 2, 1, "veg quick keto"],
  ["Grilled chicken + veggies", "1 plate", 420, 45, 15, 18, 5, "meat combo keto med"],
  ["Steak + sweet potato", "1 plate", 750, 50, 45, 38, 6, "meat combo"],
  ["Salad with chicken", "1 large bowl", 420, 35, 15, 24, 6, "meat combo keto med"],
  ["Greek yogurt + granola", "1 bowl", 330, 22, 38, 9, 3, "veg quick"],
  ["Protein shake + banana", "1 shake + 1 banana", 235, 26, 31, 2, 4, "veg quick"],
  ["Oatmeal with milk + berries", "1 bowl", 330, 13, 55, 7, 7, "veg quick"],
  ["Tuna salad", "1 bowl", 320, 30, 10, 18, 4, "fish combo keto med"],
  ["Salmon + rice + greens", "1 plate", 620, 38, 55, 26, 4, "fish combo med"],
  ["Chickpea curry + quinoa", "1 plate", 560, 22, 80, 16, 16, "vegan combo"],
  ["Tofu stir-fry + rice", "1 plate", 520, 24, 65, 17, 6, "vegan combo"],
  ["Burger + fries", "1 burger + medium fries", 950, 35, 95, 48, 7, "meat combo"],
  ["Pad thai (chicken)", "1 plate", 700, 30, 85, 26, 4, "meat combo"],
  // Gulf / Middle Eastern
  ["Chicken shawarma wrap", "1 wrap", 520, 32, 45, 22, 3, "meat combo"],
  ["Chicken shawarma plate", "1 plate with rice", 780, 45, 75, 30, 4, "meat combo"],
  ["Falafel wrap", "1 wrap", 480, 15, 55, 22, 8, "vegan combo"],
  ["Hummus", "4 tbsp", 170, 5, 14, 11, 4, "vegan med"],
  ["Tabbouleh", "1 cup", 170, 3, 17, 11, 4, "vegan med"],
  ["Fattoush", "1 bowl", 190, 3, 20, 11, 4, "vegan med"],
  ["Chicken machboos / kabsa", "1 plate", 750, 40, 85, 25, 3, "meat combo"],
  ["Lamb mandi", "1 plate", 900, 45, 85, 40, 3, "meat combo"],
  ["Grilled mixed kebab plate", "1 plate", 700, 55, 40, 35, 4, "meat combo"],
  ["Manakish zaatar", "1 piece", 420, 9, 50, 20, 3, "vegan"],
  ["Cheese manakish", "1 piece", 520, 18, 50, 27, 2, "veg"],
  ["Foul medames", "1 bowl", 330, 16, 40, 12, 12, "vegan med"],
  ["Labneh with olive oil", "3 tbsp", 150, 5, 4, 13, 0, "veg keto med"],
  ["Dates", "3 dates", 200, 2, 54, 0, 5, "vegan quick"],
  ["Karak tea", "1 cup", 150, 4, 22, 5, 0, "veg quick"],
  ["Luqaimat", "5 pieces", 300, 3, 40, 14, 1, "veg"],
  // Proteins
  ["Grilled chicken breast", "150 g", 250, 46, 0, 6, 0, "meat keto med"],
  ["Chicken thigh (grilled)", "150 g", 310, 38, 0, 17, 0, "meat keto"],
  ["Sirloin steak", "200 g", 460, 56, 0, 26, 0, "meat keto"],
  ["Ribeye steak", "250 g", 720, 60, 0, 53, 0, "meat keto"],
  ["Minced beef (lean, cooked)", "150 g", 330, 38, 0, 19, 0, "meat keto"],
  ["Salmon fillet", "150 g", 310, 34, 0, 19, 0, "fish keto med"],
  ["White fish (hammour / cod)", "150 g", 160, 34, 0, 2, 0, "fish keto med"],
  ["Shrimp", "150 g", 150, 32, 1, 2, 0, "fish keto med"],
  ["Tuna (canned in water)", "1 can (120 g)", 130, 29, 0, 1, 0, "fish keto quick"],
  ["Eggs", "2 large", 140, 12, 1, 10, 0, "veg keto quick"],
  ["Egg whites", "4 whites", 70, 15, 1, 0, 0, "veg keto"],
  ["Greek yogurt (plain, 2%)", "200 g", 150, 20, 8, 4, 0, "veg keto quick"],
  ["Cottage cheese", "200 g", 180, 24, 8, 5, 0, "veg keto quick"],
  ["Tofu (firm)", "150 g", 215, 23, 5, 13, 3, "vegan keto"],
  ["Lentils (cooked)", "1 cup", 230, 18, 40, 1, 16, "vegan med"],
  ["Chickpeas (cooked)", "1 cup", 270, 15, 45, 4, 12, "vegan med"],
  ["Protein bar", "1 bar", 210, 20, 22, 7, 3, "veg quick"],
  // Carbs
  ["White rice (cooked)", "1 cup", 205, 4, 45, 0, 1, "vegan"],
  ["Brown rice (cooked)", "1 cup", 215, 5, 45, 2, 4, "vegan med"],
  ["Pasta (cooked)", "1 cup", 220, 8, 43, 1, 3, "vegan"],
  ["Sweet potato", "1 medium", 115, 2, 27, 0, 4, "vegan med"],
  ["Potatoes (boiled)", "1 medium", 160, 4, 37, 0, 4, "vegan"],
  ["Arabic bread (khubz)", "1 round", 220, 7, 44, 2, 2, "vegan"],
  ["Toast (whole wheat)", "2 slices", 160, 8, 28, 2, 4, "vegan"],
  ["Oats (dry)", "50 g", 190, 7, 33, 3, 5, "vegan"],
  ["Quinoa (cooked)", "1 cup", 220, 8, 39, 4, 5, "vegan med"],
  ["French fries", "medium portion", 365, 4, 48, 17, 4, "vegan"],
  // Fruit & veg
  ["Banana", "1 medium", 105, 1, 27, 0, 3, "vegan quick"],
  ["Apple", "1 medium", 95, 0, 25, 0, 4, "vegan quick"],
  ["Berries", "1 cup", 70, 1, 17, 0, 4, "vegan keto"],
  ["Orange", "1 medium", 60, 1, 15, 0, 3, "vegan"],
  ["Mixed vegetables", "1 cup", 60, 3, 12, 0, 4, "vegan keto med"],
  ["Green salad (no dressing)", "1 bowl", 35, 2, 7, 0, 3, "vegan keto med"],
  ["Avocado", "1/2 fruit", 160, 2, 9, 15, 7, "vegan keto med"],
  // Fats & extras
  ["Olive oil", "1 tbsp", 120, 0, 0, 14, 0, "vegan keto med"],
  ["Almonds", "30 g", 175, 6, 6, 15, 4, "vegan keto med"],
  ["Peanut butter", "2 tbsp", 190, 8, 7, 16, 2, "vegan keto"],
  ["Cheese (cheddar)", "30 g", 120, 7, 0, 10, 0, "veg keto"],
  ["Halloumi (grilled)", "60 g", 190, 13, 1, 15, 0, "veg keto med"],
  // Drinks & treats
  ["Milk (full fat)", "1 cup", 150, 8, 12, 8, 0, "veg"],
  ["Cappuccino", "medium", 130, 7, 11, 6, 0, "veg quick"],
  ["Latte", "medium", 190, 10, 18, 7, 0, "veg quick"],
  ["Orange juice", "1 glass", 110, 2, 26, 0, 0, "vegan"],
  ["Soft drink", "1 can", 140, 0, 39, 0, 0, "vegan"],
  ["Chocolate bar", "1 bar (45 g)", 240, 3, 26, 14, 2, "veg"],
  ["Ice cream", "2 scoops", 270, 5, 32, 14, 1, "veg"],
  ["Croissant", "1", 270, 5, 30, 14, 2, "veg"]
];
const FOODS = FOOD_ROWS.map((r, i) => ({id:"f" + i, name:r[0], serving:r[1], kcal:r[2], protein:r[3], carbs:r[4], fat:r[5], fiber:r[6], tags:r[7].split(" ")}));
/* The quick-add buttons everyone starts with (favourites are added after two logs of the same meal). */
const DEFAULT_QUICK = ["Sandwich (chicken or turkey)", "Bowl of rice + protein", "Coffee + pastry", "Pizza slice", "Eggs + toast", "Protein shake", "Grilled chicken + veggies", "Chicken shawarma wrap"];

/* v5.1: saturated fat (g) and sodium (mg) per serving — typical values from standard nutrition tables. */
const FOOD_SAT_SODIUM = {
  "Sandwich (chicken or turkey)":[3,1100], "Bowl of rice + protein":[4,900], "Coffee + pastry":[11,350], "Pizza slice":[5,640],
  "Eggs + toast":[4.5,450], "Protein shake":[1,150], "Grilled chicken + veggies":[4,500], "Steak + sweet potato":[15,450],
  "Salad with chicken":[5,700], "Greek yogurt + granola":[3,120], "Protein shake + banana":[1,150], "Oatmeal with milk + berries":[3,110],
  "Tuna salad":[3,600], "Salmon + rice + greens":[5,400], "Chickpea curry + quinoa":[5,800], "Tofu stir-fry + rice":[2.5,900],
  "Burger + fries":[15,1500], "Pad thai (chicken)":[5,1800], "Chicken shawarma wrap":[6,1300], "Chicken shawarma plate":[8,1600],
  "Falafel wrap":[3,1100], "Hummus":[1.5,300], "Tabbouleh":[1.5,250], "Fattoush":[1.5,400], "Chicken machboos / kabsa":[8,1200],
  "Lamb mandi":[16,1300], "Grilled mixed kebab plate":[13,1200], "Manakish zaatar":[3,700], "Cheese manakish":[12,900],
  "Foul medames":[2,700], "Labneh with olive oil":[5,200], "Dates":[0,1], "Karak tea":[3,60], "Luqaimat":[3,150],
  "Grilled chicken breast":[1.5,110], "Chicken thigh (grilled)":[5,140], "Sirloin steak":[10,120], "Ribeye steak":[23,140],
  "Minced beef (lean, cooked)":[8,100], "Salmon fillet":[4,90], "White fish (hammour / cod)":[0.4,120], "Shrimp":[0.4,170],
  "Tuna (canned in water)":[0.3,300], "Eggs":[3,140], "Egg whites":[0,220], "Greek yogurt (plain, 2%)":[2.5,70], "Cottage cheese":[3,700],
  "Tofu (firm)":[2,20], "Lentils (cooked)":[0.1,5], "Chickpeas (cooked)":[0.4,10], "Protein bar":[3,200],
  "White rice (cooked)":[0.1,2], "Brown rice (cooked)":[0.4,10], "Pasta (cooked)":[0.3,2], "Sweet potato":[0,70], "Potatoes (boiled)":[0,10],
  "Arabic bread (khubz)":[0.3,450], "Toast (whole wheat)":[0.4,300], "Oats (dry)":[0.5,2], "Quinoa (cooked)":[0.5,13], "French fries":[2.5,250],
  "Banana":[0.1,1], "Apple":[0,2], "Berries":[0,1], "Orange":[0,0], "Mixed vegetables":[0,60], "Green salad (no dressing)":[0,30],
  "Avocado":[2,7], "Olive oil":[2,0], "Almonds":[1.1,0], "Peanut butter":[3,140], "Cheese (cheddar)":[6,190], "Halloumi (grilled)":[10,800],
  "Milk (full fat)":[4.5,105], "Cappuccino":[3.5,100], "Latte":[4,140], "Orange juice":[0,2], "Soft drink":[0,45],
  "Chocolate bar":[8,35], "Ice cream":[9,100], "Croissant":[8,300]
};
FOODS.forEach(f => { const x = FOOD_SAT_SODIUM[f.name] || [0, 0]; f.satFat = x[0]; f.sodium = x[1]; });
