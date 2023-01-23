import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from "vee-validate";
import {
  required,
  min,
  max,
  alpha_spaces,
  email,
  numeric,
  max_value,
  min_value,
  confirmed,
  not_one_of,
} from "@vee-validate/rules";

export default {
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha_spaces", alpha_spaces);
    defineRule("email", email);
    defineRule("numeric", numeric);
    defineRule("max_value", max_value);
    defineRule("min_value", min_value);
    defineRule("confirmed", confirmed);
    defineRule("not_one_of", not_one_of);

    // custom rules define
    defineRule("password_mismatch", confirmed);
    defineRule("country_excluded", not_one_of);
    defineRule("tos", required);
    defineRule("song_title", required);

    // configure error message
    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The ${ctx.field} field is required.`,
          min: `The ${ctx.field} field is too short.`,
          max: `The ${ctx.field} field is too long.`,
          alpha_spaces: `The ${ctx.field} field must only contain alphabetical characters and spaces.`,
          email: `The ${ctx.field} field must be a valid email.`,
          min_value: `The ${ctx.field} field is too low.`,
          max_value: `The ${ctx.field} field is too high.`,
          not_one_of: `You are not allowed to use this value for the field ${ctx.field}.`,
          password_mismatch: `The passwords are not match.`,
          country_excluded: `Due to restrictions , can't create account from your location.`,
          tos: `You must agree our terms of servie.`,
          song_title : "Song title field is required"
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `This ${ctx.field} field is invalid.`;

        return message;
      },

      validateOnBlur: true,
      validateOnChange: true,
      validateOnModelUpdate: true,
      validateOnInput: false,
    });
  },
};
