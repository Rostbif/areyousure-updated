// options page url: chrome-extension://jjpdibgobimgimipjcgjoiplmaocddhp/src/options2.html
// @ts-nocheck

(function () {
  let catchError = function (f) {
    return function () {
      if (chrome.runtime.lastError) {
        return alert(chrome.runtime.lastError.string);
      } else if (f) {
        return f.apply(this, arguments);
      }
    };
  };

  let $ = document.querySelector.bind(document);
  let storage = chrome.storage.sync;
  // Get the values currently in the storage, and build the page.
  syncWithStorage();

  $("#holdTime").addEventListener("input", function () {
    return storage.set(
      {
        holdTime: parseFloat($("#holdTime").value),
      },
      catchError()
    );
  });

  $("#cooldown").addEventListener("input", function () {
    return storage.set(
      {
        cooldown: parseFloat($("#cooldown").value),
      },
      catchError()
    );
  });

  $("#dimming").addEventListener("input", function () {
    return storage.set(
      {
        backdropOpacity: parseFloat($("#dimming").value) / 100,
      },
      catchError()
    );
  });

  $("#explanation").addEventListener("input", function () {
    return storage.set(
      {
        defaultExplanation: $("#explanation").value,
      },
      catchError()
    );
  });

  // functions area
  function syncWithStorage() {
    storage.get(
      {
        sites: [],
        holdTime: 2,
        cooldown: 5,
        backdropOpacity: 0.8,
        defaultExplanation: "Default",
      },
      catchError(function (args) {
        // Get the sites from the storage, the sites object will be accessible for all functions in this scope
        let sites = args.sites;

        // Set the sites text area with the sites from the storage
        $("#sites").value = (function () {
          let site;
          let results = [];
          for (let i = 0; i < sites.length; i++) {
            site = sites[i];
            results.push(site.hostSuffix);
          }

          return results;
        })().join("\n");

        // Create the site containers
        for (let i = 0; i < sites.length; i++) {
          addSiteContainer(sites, i, "exist");
        }

        let handleAddSite = (e) => {
          addSiteContainer(sites, sites.length, "new");
        };

        $("#addSite").addEventListener("click", handleAddSite);

        // Set the other input elements with the values from the storage
        $("#holdTime").value = args.holdTime;
        $("#cooldown").value = args.cooldown;
        $("#explanation").value = args.defaultExplanation;

        return ($("#dimming").value = Math.round(args.backdropOpacity * 100));
      })
    );

    $("#sites").addEventListener("input", function () {
      let site;

      let sites = (function () {
        var ref, results;
        ref = $("#sites").value.split("\n");
        results = [];
        for (let i = 0; i < ref.length; i++) {
          site = ref[i];
          if (site) {
            results.push({
              hostSuffix: site,
            });
          }
        }
        return results;
      })();

      return storage.set(
        {
          sites: sites,
        },
        catchError()
      );
    });
  }

  function addSiteContainer(sites, i, existOrNew) {
    let siteContainer = document.createElement("div");
    siteContainer.classList.add("siteContainer");

    let siteInput = document.createElement("input");
    siteInput.setAttribute("type", "text");

    let defExpCheckBox = document.createElement("input");
    setMultipleAttributes(defExpCheckBox, {
      type: "checkbox",
      //id: "defExpCheckBox",
      name: "defExpCheckBox",
      value: "User default explanation?",
    });

    let button;

    let explanationInput;

    if (existOrNew === "exist") {
      // set the values according to storage
      siteInput.setAttribute("value", sites[i].hostSuffix);
      defExpCheckBox.checked = sites[i].useDefaultExplanation;
      defExpCheckBox.disabled = true;

      if (!defExpCheckBox.checked) {
        explanationInput = document.createElement("input");
        explanationInput.type = "text";
        explanationInput.value = sites[i].explanation;
        explanationInput.classList.add(["explanationInput"]);
        explanationInput.disabled = true;
      }

      button = createDeleteButton();
      button.addEventListener("click", function (b) {
        // remove the site from the storage
        sites.splice(i, 1);
        storage.set(
          {
            sites: sites,
          },
          catchError()
        );
        // delete the parent element of the button, which is the div.siteContainer
        b.target.parentElement.remove();
      });
    } else if (existOrNew === "new") {
      // use default values
      defExpCheckBox.checked = true;
      let handleCheckboxChange = function (e) {
        // if the checkbox is checked, create another input for the explanation
        if (!e.target.checked) {
          explanationInput = document.createElement("input");
          explanationInput.type = "text";
          explanationInput.placeholder = "Insert here your explanation";
          explanationInput.classList.add(["explanationInput"]);
          e.target.parentElement.appendChild(explanationInput);
        }
        let explanationInputElement =
          e.target.parentElement.querySelector(".explanationInput");

        if (e.target.checked && explanationInputElement) {
          explanationInputElement.remove();
        }
      };
      defExpCheckBox.addEventListener("change", handleCheckboxChange);

      button = createAddButton();
      let handleAddingSite = function (b) {
        // remove the site from the storage
        let site = b.target.parentElement.querySelector("input").value;
        let checkbox = b.target.parentElement.querySelector(
          "input[type=checkbox]"
        );
        let explanation =
          b.target.parentElement.querySelector(".explanationInput")?.value ||
          "";

        sites.push({
          hostSuffix: site,
          useDefaultExplanation: checkbox.checked,
          explanation: explanation,
        });

        storage.set(
          {
            sites: sites,
          },
          catchError()
        );
        // delete the parent element of the button, which is the div.siteContainer
        b.target.parentElement.remove();
        addSiteContainer(sites, sites.length - 1, "exist");
      };

      button.addEventListener("click", handleAddingSite);
    }

    let checkboxLabel = document.createElement("label");
    checkboxLabel.innerHTML = "Use default explanation?";
    checkboxLabel.classList.add("checkboxLabel");

    siteContainer.appendChild(siteInput);
    siteContainer.appendChild(button);
    siteContainer.appendChild(defExpCheckBox);
    siteContainer.appendChild(checkboxLabel);
    // If the expalnation input exist, then we want to add it to the container
    if (explanationInput) {
      siteContainer.appendChild(explanationInput);
    }
    $("#sitesContainer").appendChild(siteContainer);
  }

  function createDeleteButton() {
    // create a button with an X icon
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&#10006;";
    deleteButton.classList.add("deleteButton");
    return deleteButton;
  }

  function createAddButton() {
    // create a button with an X icon
    let addButton = document.createElement("button");
    addButton.innerHTML = "&#43;";
    addButton.classList.add("addButton");
    return addButton;
  }

  function setMultipleAttributes(element, attributes) {
    for (let key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
  }
}).call(this);
