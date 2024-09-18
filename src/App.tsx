import clsx from "clsx";
import {
  GenderConst,
  IntlVariations,
  IntlViewerContext,
  fbs,
  fbt,
  init,
} from "fbt";
import * as React from "react";
import "./App.css";
import translations from "./translatedFbts.json";
import ExampleEnum from "./Example$FbtEnum";

const viewerContext = {
  GENDER: IntlVariations.GENDER_UNKNOWN,
  locale: "en_US",
} satisfies IntlViewerContext;

init({
  translations,
  hooks: {
    getViewerContext: () => viewerContext,
  },
});

const LOCALES = {
  en_US: {
    bcp47: "en-US",
    displayName: "English (US)\u200e",
    englishName: "English (US)",
    rtl: false,
  },
  fb_HX: {
    bcp47: "fb-HX",
    displayName: "l33t 5p34k",
    englishName: "FB H4x0r",
    rtl: false,
  },
  es_LA: {
    bcp47: "es-419",
    displayName: "Espa\u00F1ol",
    englishName: "Spanish",
    rtl: false,
  },
  ar_AR: {
    bcp47: "ar",
    displayName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    englishName: "Arabic",
    rtl: true,
  },
  he_IL: {
    bcp47: "he",
    displayName: "\u05E2\u05D1\u05E8\u05D9\u05EA",
    englishName: "Hebrew",
    rtl: true,
  },
  ja_JP: {
    bcp47: "ja",
    displayName: "\u65E5\u672C\u8A9E",
    englishName: "Japanese",
    rtl: false,
  },
  ru_RU: {
    bcp47: "ru",
    displayName: "Русский",
    englishName: "Russian",
    rtl: false,
  },
} as const;

type Locale = keyof typeof LOCALES;

export default function Example() {
  const [, forceUpdate] = React.useReducer((s) => s + 1, 0);

  const [state, setState] = React.useState({
    locale: viewerContext.locale,
    ex1Name: "Someone",
    ex1Gender: IntlVariations.GENDER_UNKNOWN,
    ex1Count: 1,
    ex2Name: "Someone",
    ex2Object: "LINK",
    ex2Pronoun: GenderConst.UNKNOWN_SINGULAR,
  });

  const setLocale = React.useCallback((locale: Locale) => {
    viewerContext.locale = locale;
    setState((prev) => ({ ...prev, locale }));
    const html = document.getElementsByTagName("html")[0];
    if (html != null) {
      html.lang = LOCALES[locale].bcp47;
    }
    document.body.className = LOCALES[locale].rtl ? "rtl" : "ltr";
  }, []);

  const onSubmit = (event: React.FormEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div>
      <div className="example">
        <div className="warning">
          <fbt desc="title">Your FBT Demo</fbt>
        </div>
        <h1>
          <fbt desc="header">Construct sentences</fbt>
        </h1>
        <h2>
          {/* For fbt common strings, the description will be sourced from an external manifest.
          See `--fbt-common-path` option from `fbt-collect` and common_strings.json */}
          {/* @ts-expect-error Fix fbt types */}
          <fbt common>Use the form below to see FBT in action.</fbt>
        </h2>
        <form action="" method="get" onSubmit={onSubmit}>
          <fieldset>
            <span className="example_row">
              <span className="example_input--30">
                <select
                  className="neatoSelect"
                  onChange={(event) => {
                    const vcGender = parseInt(event.target.value, 10);
                    viewerContext.GENDER = vcGender;
                    forceUpdate();
                  }}
                >
                  <option value={IntlVariations.GENDER_UNKNOWN}>
                    <fbt desc="Gender Select label">Your Gender:</fbt>
                  </option>
                  <option value={IntlVariations.GENDER_UNKNOWN}>
                    <fbt desc="Unknown gender">Unknown</fbt>
                  </option>
                  <option value={IntlVariations.GENDER_MALE}>
                    <fbt desc="Male gender">Male</fbt>
                  </option>
                  <option value={IntlVariations.GENDER_FEMALE}>
                    <fbt desc="Female gender">Female</fbt>
                  </option>
                </select>
              </span>
            </span>
          </fieldset>

          <fieldset>
            <span className={clsx("example_row", "example_row--multi")}>
              <span className={clsx("example_input", "example_input--40")}>
                <input
                  name="name"
                  onChange={(event) => {
                    setState((prev) => ({
                      ...prev,
                      ex1Name: event.target.value,
                    }));
                  }}
                  placeholder={fbs("name", "name field")}
                  type="text"
                />
              </span>
              <span className={clsx("example_input", "example_input--30")}>
                <input
                  name="count"
                  onChange={(event) => {
                    const val = parseInt(event.target.value, 10);
                    setState((prev) => ({
                      ...prev,
                      ex1Count: isNaN(val) ? 1 : val,
                    }));
                  }}
                  placeholder={fbs("count", "count field")}
                  type="number"
                />
              </span>
              <span className="example_row">
                <select
                  className="neatoSelect"
                  onChange={(event) => {
                    setState((prev) => ({
                      ...prev,
                      ex1Gender: parseInt(event.target.value, 10),
                    }));
                  }}
                >
                  <option value={IntlVariations.GENDER_UNKNOWN}>
                    <fbs desc="Gender Select label">Gender:</fbs>
                  </option>
                  <option value={IntlVariations.GENDER_UNKNOWN}>
                    <fbs desc="Unknown gender">Unknown</fbs>
                  </option>
                  <option value={IntlVariations.GENDER_MALE}>
                    <fbs desc="Male gender">Male</fbs>
                  </option>
                  <option value={IntlVariations.GENDER_FEMALE}>
                    <fbs desc="Female gender">Female</fbs>
                  </option>
                </select>
              </span>
            </span>
          </fieldset>

          <fieldset className="example_row">
            <div className="sentence ">
              <span>
                <fbt desc="example 1">
                  {/* @ts-expect-error Fix fbt types */}
                  <fbt:param gender={state.ex1Gender} name="name">
                    <b>{state.ex1Name}</b>
                  </fbt:param>
                  has shared
                  <a className="neatoLink" href="#">
                    <fbt:plural
                      count={state.ex1Count}
                      many="photos"
                      showCount="ifMany"
                    >
                      a photo
                    </fbt:plural>
                  </a>
                  with you
                </fbt>
              </span>
            </div>
          </fieldset>

          <fieldset>
            <span className={clsx("example_row", "example_row--multi")}>
              <span className={clsx("example_input", "example_input--40")}>
                <input
                  name="ex2Name"
                  onChange={(event) => {
                    setState((prev) => ({
                      ...prev,
                      ex2Name: event.target.value,
                    }));
                  }}
                  placeholder={fbs("name", "name field")}
                  type="text"
                />
              </span>
              <span className={clsx("example_input", "example_input--20")}>
                <select
                  className="neatoSelect"
                  onChange={(event) => {
                    setState((prev) => ({
                      ...prev,
                      ex2Object: event.target.value,
                    }));
                  }}
                >
                  {Object.entries(ExampleEnum).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </span>
              <span className={clsx("example_row", "example_input--20")}>
                <select
                  className="neatoSelect"
                  onChange={(event) => {
                    setState((prev) => ({
                      ...prev,
                      ex2Pronoun: parseInt(event.target.value, 10),
                    }));
                  }}
                >
                  <option value={GenderConst.UNKNOWN_PLURAL}>
                    <fbs desc="Gender Select label">Gender:</fbs>
                  </option>
                  <option value={GenderConst.NOT_A_PERSON}>
                    <fbs desc="Gender Select label">Not a person</fbs>
                  </option>
                  <option value={GenderConst.UNKNOWN_PLURAL}>
                    <fbs desc="Gender Select label">Unknown (Plural)</fbs>
                  </option>
                  <option value={GenderConst.UNKNOWN_SINGULAR}>
                    <fbs desc="Gender Select label">Unknown (singular)</fbs>
                  </option>
                  <option value={GenderConst.MALE_SINGULAR}>
                    <fbs desc="Gender Select label">Male (singular)</fbs>
                  </option>
                  <option value={GenderConst.FEMALE_SINGULAR}>
                    <fbs desc="Gender Select label">Female (singular)</fbs>
                  </option>
                </select>
              </span>
            </span>
          </fieldset>
          <fieldset className="example_row">
            <div className="sentence ">
              <span>
                <fbt desc="Example enum & pronoun">
                  <fbt:param name="name">
                    <b>
                      <a href="#">{state.ex2Name}</a>
                    </b>
                  </fbt:param>
                  has a
                  <fbt:enum enum-range={ExampleEnum} value={state.ex2Object} />
                  to share!{" "}
                  <b>
                    <a href="#">View</a>
                  </b>{" "}
                  <fbt:pronoun
                    gender={state.ex2Pronoun}
                    human={false}
                    type="possessive"
                  />{" "}
                  <fbt:enum enum-range={ExampleEnum} value={state.ex2Object} />.
                </fbt>
              </span>
            </div>
          </fieldset>
          <fieldset>
            <span className="example_row">
              <button
                className="bottom"
                onClick={() => {
                  window.open("https://github.com/facebook/fbt", "_blank");
                }}
                type="submit"
              >
                {fbt("Try it out!", "Sign up button")}
              </button>
            </span>
          </fieldset>
        </form>
      </div>
      <ul className="languages">
        {(Object.keys(LOCALES) as Array<Locale>).map((loc) => (
          <li key={loc} value={loc}>
            {state.locale === loc ? (
              LOCALES[loc].displayName
            ) : (
              <a
                href={`#${loc}`}
                onClick={(event) => {
                  event.preventDefault();
                  setLocale(loc);
                }}
              >
                {LOCALES[loc].displayName}
              </a>
            )}
          </li>
        ))}
      </ul>
      <p className="copyright">{`Facebook \u00A9 2021`}</p>
    </div>
  );
}
