// ═══════════════════════════════════════════════════════════
// DIET CONTROLLER
// Displays custom meals, macro totals, budget markers, and shopping list modal
// ═══════════════════════════════════════════════════════════

const Diet = {
  async init() {
    this.renderSkeleton();
    await this.fetchAndRender();
  },

  renderSkeleton() {
    const container = document.getElementById('page-container');
    if (!container) return;

    container.innerHTML = `
      <div class="page-header">
        <div class="skeleton-title skeleton"></div>
      </div>
      <div class="skeleton-card skeleton" style="height:150px;"></div>
      <div class="skeleton-card skeleton" style="height:120px;"></div>
      <div class="skeleton-card skeleton" style="height:120px;"></div>
    `;
  },

  async fetchAndRender() {
    const container = document.getElementById('page-container');
    if (!container) return;

    try {
      const data = await API.getCurrentDiet();
      if (!data || !data.plan) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🥗</div>
            <h2 class="empty-title">No Diet Plan Active</h2>
            <p class="empty-description">You haven't generated a meal plan yet. Complete your profile to build a custom nutrition strategy!</p>
            <button class="btn btn-primary" onclick="window.location.hash='#profile'">Setup Profile & Plans</button>
          </div>
        `;
        return;
      }

      const plan = data.plan;

      container.innerHTML = `
        <!-- Header -->
        <div class="plan-header">
          <div>
            <h1 class="text-green">🥗 Custom Diet & Meal Plan</h1>
            <div class="plan-meta mt-1">
              <span class="meta-tag">🍽️ Meals: ${plan.meals.length} / Day</span>
              <span class="meta-tag">⚡ Calories: ${plan.daily_totals.calories} kcal</span>
            </div>
          </div>
          <div class="quick-actions">
            <button class="btn btn-secondary" id="btn-shopping-list">🛒 Shopping List</button>
            <button class="btn btn-secondary" id="btn-regenerate-diet">🔄 Regenerate Plan</button>
          </div>
        </div>

        <!-- Meals list -->
        <div class="meal-timeline mt-3">
          ${plan.meals.map(meal => {
            const icon = this.getMealIcon(meal.meal_type);
            const budgetStr = meal.budget_tag === 'low' ? 'Tight Budget' : 'Moderate';
            return `
              <div class="meal-card">
                <div class="meal-time-badge">
                  <span class="meal-type-icon">${icon}</span>
                  <span class="meal-time">${meal.meal_type}</span>
                </div>
                <div class="meal-details">
                  <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                    <span class="meal-name">${meal.name}</span>
                    <span class="shopping-freq" style="background:rgba(251,146,60,0.15); color:#fb923c;">💰 ${budgetStr}</span>
                  </div>
                  <div class="meal-description">${meal.description || 'Nutrient-rich energetic meal.'}</div>
                  
                  <div style="margin: 0.5rem 0;">
                    <strong style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase;">Ingredients:</strong>
                    <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-top:0.25rem;">
                      ${meal.ingredients.map(ing => `
                        <span class="meta-tag" style="padding: 0.15rem 0.5rem; font-size: 0.75rem;">
                          ${ing.name} (${ing.amount})
                        </span>
                      `).join('')}
                    </div>
                  </div>

                  <div class="meal-macros mt-2">
                    <span class="macro-badge cal">🔥 ${meal.calories} kcal</span>
                    <span class="macro-badge protein">🥩 P: ${meal.protein}g</span>
                    <span class="macro-badge carbs">🌾 C: ${meal.carbs}g</span>
                    <span class="macro-badge fat">🥑 F: ${meal.fat}g</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Daily Nutrition Summary totals -->
        <div class="daily-totals mt-3">
          <h3 style="font-size:0.95rem; font-weight:600; margin-bottom:1rem; text-transform:uppercase;">Daily Totals Breakdown</h3>
          <div class="daily-totals-grid">
            <div class="total-item">
              <span class="total-value">${plan.daily_totals.calories}</span>
              <span class="total-label">Calories (kcal)</span>
              <div class="total-bar"><div class="total-bar-fill" style="width: 100%; background: var(--accent-yellow);"></div></div>
            </div>
            <div class="total-item">
              <span class="total-value">${plan.daily_totals.protein}g</span>
              <span class="total-label">Protein</span>
              <div class="total-bar"><div class="total-bar-fill" style="width: 80%; background: var(--accent-red);"></div></div>
            </div>
            <div class="total-item">
              <span class="total-value">${plan.daily_totals.carbs}g</span>
              <span class="total-label">Carbohydrates</span>
              <div class="total-bar"><div class="total-bar-fill" style="width: 65%; background: var(--accent-cyan);"></div></div>
            </div>
            <div class="total-item">
              <span class="total-value">${plan.daily_totals.fat}g</span>
              <span class="total-label">Fats</span>
              <div class="total-bar"><div class="total-bar-fill" style="width: 50%; background: var(--accent-orange);"></div></div>
            </div>
          </div>
        </div>

        <!-- Shopping List Modal -->
        <div id="shopping-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:1000; align-items:center; justify-content:center;">
          <div class="glass-card" style="max-width:440px; width:100%; max-height:80vh; display:flex; flex-direction:column; padding:2rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h2 style="font-family:var(--font-display); font-size:1.5rem;">🛒 Weekly Shopping List</h2>
              <button id="btn-close-shopping" style="font-size:1.5rem; color:var(--text-muted); cursor:pointer;">&times;</button>
            </div>
            <p class="text-muted mb-2" style="font-size:0.85rem;">Consolidated list of ingredients needed for your weekly plans:</p>
            <div style="flex:1; overflow-y:auto; padding-right:0.5rem;" class="shopping-list">
              ${this.generateShoppingItems(plan)}
            </div>
            <button class="btn btn-primary mt-3" id="btn-print-shopping" style="width:100%;">Print / Copy List</button>
          </div>
        </div>
      `;

      this.attachEventListeners(plan);

    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },

  getMealIcon(mealType) {
    const type = mealType.toLowerCase();
    if (type.includes('breakfast')) return '🍳';
    if (type.includes('lunch')) return '🍱';
    if (type.includes('dinner')) return '🍲';
    if (type.includes('snack')) return '🍎';
    return '🥗';
  },

  generateShoppingItems(plan) {
    const uniqueIngredients = {};
    plan.meals.forEach(meal => {
      meal.ingredients.forEach(ing => {
        const name = ing.name.trim();
        if (uniqueIngredients[name]) {
          uniqueIngredients[name].amounts.push(ing.amount);
        } else {
          uniqueIngredients[name] = {
            name,
            amounts: [ing.amount],
            frequency: ing.frequency || 'weekly'
          };
        }
      });
    });

    return Object.values(uniqueIngredients).map(ing => {
      const consolidatedAmount = ing.amounts.join(' / ');
      return `
        <div class="shopping-item">
          <div class="shopping-item-name">
            <input type="checkbox" style="accent-color:var(--accent-cyan);">
            <span>${ing.name}</span>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="text-cyan" style="font-weight:600; font-size:0.85rem;">${consolidatedAmount}</span>
            <span class="shopping-freq">${ing.frequency}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  attachEventListeners(plan) {
    // Shopping list modal triggers
    const modal = document.getElementById('shopping-modal');
    const triggerBtn = document.getElementById('btn-shopping-list');
    const closeBtn = document.getElementById('btn-close-shopping');

    if (triggerBtn && modal && closeBtn) {
      triggerBtn.onclick = () => { modal.style.display = 'flex'; };
      closeBtn.onclick = () => { modal.style.display = 'none'; };
      window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    }

    // Print button
    const printBtn = document.getElementById('btn-print-shopping');
    if (printBtn) {
      printBtn.onclick = () => {
        const uniqueIngredients = {};
        plan.meals.forEach(meal => {
          meal.ingredients.forEach(ing => {
            const name = ing.name.trim();
            if (uniqueIngredients[name]) {
              uniqueIngredients[name].amounts.push(ing.amount);
            } else {
              uniqueIngredients[name] = { name, amounts: [ing.amount] };
            }
          });
        });

        const text = Object.values(uniqueIngredients)
          .map(ing => `- [ ] ${ing.name} (${ing.amounts.join(' / ')})`)
          .join('\n');
        
        navigator.clipboard.writeText(text);
        App.showToast('Shopping list copied to clipboard!', 'success');
      };
    }

    // Regenerate
    const regenBtn = document.getElementById('btn-regenerate-diet');
    if (regenBtn) {
      regenBtn.onclick = async () => {
        if (!confirm('Are you sure you want to regenerate your nutrition meal plan?')) return;
        
        regenBtn.disabled = true;
        regenBtn.classList.add('btn-loading');
        try {
          await API.generateDiet();
          App.showToast('New AI Diet Plan Generated!', 'success');
          await this.fetchAndRender();
        } catch (err) {
          App.showToast(err.message, 'error');
        } finally {
          regenBtn.disabled = false;
          regenBtn.classList.remove('btn-loading');
        }
      };
    }
  }
};
