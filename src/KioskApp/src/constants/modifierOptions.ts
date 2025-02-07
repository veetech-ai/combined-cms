export const INSTRUCTIONS_BY_CATEGORY = {
  burgers: {
    cooking: {
      temperature: ['Medium Rare', 'Medium', 'Medium Well', 'Well Done'],
      protein: ['Double Patty', 'Extra Cheese', 'No Cheese'],
      additions: ['Add Bacon', 'Add Egg', 'Add Avocado']
    },
    assembly: {
      vegetables: ['No Lettuce', 'Extra Lettuce', 'No Tomatoes', 'Extra Tomatoes', 'No Onions', 'Extra Onions'],
      sauces: ['Extra Mayo', 'No Mayo', 'Extra Ketchup', 'No Ketchup', 'BBQ Sauce', 'Chipotle Sauce'],
      extras: ['No Pickles', 'Extra Pickles', 'Cut in Half']
    }
  },
  pizzas: {
    cooking: {
      crust: ['Extra Crispy', 'Soft Crust', 'Well Done'],
      cheese: ['Extra Cheese', 'Light Cheese', 'No Cheese'],
      baking: ['Extra Sauce', 'Light Sauce']
    },
    assembly: {
      toppings: ['Extra Pepperoni', 'No Onions', 'Extra Onions', 'No Bell Peppers', 'Extra Mushrooms'],
      finishing: ['Add Oregano', 'Add Chili Flakes', 'Add Parmesan'],
      cutting: ['Cut in 6 Slices', 'Cut in 8 Slices', 'Cut in Squares']
    }
  },
  drinks: {
    preparation: {
      ice: ['No Ice', 'Light Ice', 'Extra Ice'],
      sweetness: ['Less Sweet', 'Extra Sweet', 'Sugar Free'],
      extras: ['Add Lemon', 'Add Lime', 'Add Mint']
    }
  }
};