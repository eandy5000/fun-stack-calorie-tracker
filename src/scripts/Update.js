import * as R from "ramda";

const MSG = {
  SHOW_FORM: "SHOW_FORM",
  MEAL_INPUT: "MEAL_INPUT",
  CALORIES_INPUT: "CALORIES_INPUT",
  SAVE_MEAL: "SAVE_MEAL",
  DELETE_MEAL: "DELETE_MEAL",
  EDIT_MEAL: "EDIT_MEAL"
};

export const saveMealMsg = { type: MSG.SAVE_MEAL };

export function editMealMsg(editId) {
  return {
    type: MSG.EDIT_MEAL,
    editId
  };
}

export function deleteMealMsg(id) {
  return {
    type: MSG.DELETE_MEAL,
    id
  };
}

export function showFormMsg(showForm) {
  return {
    type: MSG.SHOW_FORM,
    showForm
  };
}
export function mealInputMsg(description) {
  return {
    type: MSG.MEAL_INPUT,
    description
  };
}
export function calorieInputMsg(calories) {
  return {
    type: MSG.CALORIES_INPUT,
    calories
  };
}

function update(msg, model) {
  switch (msg.type) {
    case MSG.SHOW_FORM:
      return Object.assign({}, model, {
        showForm: msg.showForm,
        description: "",
        calories: 0
      });
    case MSG.MEAL_INPUT:
      return Object.assign({}, model, { description: msg.description });
    case MSG.CALORIES_INPUT:
      const calories = R.pipe(parseInt, R.defaultTo(0))(msg.calories);
      return Object.assign({}, model, { calories });
    case MSG.SAVE_MEAL:
      const updateModel =
        model.editId !== null ? edit(msg, model) : add(msg, model);
      return updateModel;
    case MSG.DELETE_MEAL:
      const { id } = msg;
      const meals = R.filter(meal => meal.id != id)(model.meals);
      return Object.assign({}, model, { meals });
    case MSG.EDIT_MEAL:
      const { editId } = msg;
      const meal = R.find(meal => meal.id === editId, model.meals);

      const { description } = meal;
      return Object.assign({}, model, {
        editId,
        calories: meal.calories,
        description,
        showForm: true
      });
  }
  return model;
}

function add(msg, model) {
  const { calories, description, nextId } = model;
  const meal = { id: nextId, calories, description };
  const meals = model.meals.concat(meal);
  return Object.assign({}, model, {
    meals,
    description: "",
    calories: 0,
    showForm: false,
    nextId: model.nextId + 1
  });
}

function edit(msg, model) {
  const { description, calories, editId } = model;
  const meals = R.map(meal => {
    if (meal.id === editId) {
      return Object.assign({}, meal, { description, calories });
    }
    return meal;
  }, model.meals);

  return Object.assign({}, model, {
    meals,
    description: "",
    calories: 0,
    showForm: false,
    editId: null
  });
}

export default update;
