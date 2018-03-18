import h from "hyperscript";
import hh from "hyperscript-helpers";
import * as R from "ramda";

const {
  div,
  h1,
  button,
  form,
  label,
  input,
  table,
  tr,
  th,
  td,
  thead,
  tbody,
  a
} = hh(h);

import {
  showFormMsg,
  mealInputMsg,
  calorieInputMsg,
  saveMealMsg,
  deleteMealMsg,
  editMealMsg
} from "./Update";

function buttonSet(dispatch) {
  return div([
    button(
      {
        className: "f3 pv2 ph3 bg-blue white bn mr2 dim",
        type: "submit"
      },
      "save"
    ),
    button(
      {
        className: "f3 pv2 ph3 bg-red white bn mr2 dim",
        type: "button",
        onclick: () => dispatch(showFormMsg(false))
      },
      "cancel"
    )
  ]);
}

function fieldSet(labelText, inputValue, inputFunction) {
  return div([
    label({ className: "db mb1" }, labelText),
    input({
      className: "pa2 input-reset ba mb2 w-100",
      type: "text",
      value: inputValue,
      onchange: inputFunction
    })
  ]);
}

function formView(dispatch, model) {
  const { description, calories, showForm } = model;

  if (showForm) {
    return form(
      {
        className: "mv2 w-100",
        onsubmit: e => {
          e.preventDefault();
          dispatch(saveMealMsg);
        }
      },
      [
        fieldSet("meal", description, e =>
          dispatch(mealInputMsg(e.target.value))
        ),
        fieldSet("calories", calories || "", e =>
          dispatch(calorieInputMsg(e.target.value))
        ),
        buttonSet(dispatch)
      ]
    );
  }

  return button(
    {
      onclick: () => dispatch(showFormMsg(true)),
      className: "f3 pv2 ph3 bg-blue white bn dim"
    },
    "Add Meal"
  );
}

const tableHeader = tr([th("Meal"), th("Calories"), th("")]);

function mealsMap(dispatch, meal) {
  return tr({ className: "stripe-dark" }, [
    td(meal.description),
    td(meal.calories),
    td([
      a(
        {
          href: "#",
          className: "ph1 dim",
          onclick: () => dispatch(editMealMsg(meal.id))
        },
        "edit"
      ),
      a(
        {
          href: "#",
          className: "ph1 dim",
          onclick: () => dispatch(deleteMealMsg(meal.id))
        },
        "delete"
      )
    ])
  ]);
}

function tableRows(model, dispatch) {
  const rows = R.map(R.partial(mealsMap, [dispatch]), model.meals);
  return rows;
}

function tableTotal(model) {
  const total = R.pipe(R.map(meal => meal.calories), R.sum)(model.meals);
  return tr({ className: "bt" }, [td("Total"), td(total)]);
}

function view(dispatch, model) {
  return div({ className: "mw6 center" }, [
    h1({ className: "f2 pv2 bb" }, "Calorie Counter"),
    formView(dispatch, model),
    table(
      { className: "collapse" },
      tableHeader,
      tableRows(model, dispatch),
      tableTotal(model)
    )
  ]);
}

export default view;
