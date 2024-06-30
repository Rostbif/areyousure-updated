/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/options2.ts":
/*!*************************!*\
  !*** ./src/options2.ts ***!
  \*************************/
/***/ (function() {


// options page url: chrome-extension://jjpdibgobimgimipjcgjoiplmaocddhp/src/options2.html
// @ts-nocheck
(function () {
    let catchError = function (f) {
        return function () {
            if (chrome.runtime.lastError) {
                return alert(chrome.runtime.lastError.string);
            }
            else if (f) {
                return f.apply(this, arguments);
            }
        };
    };
    let $ = document.querySelector.bind(document);
    let storage = chrome.storage.sync;
    // Get the values currently in the storage, and build the page.
    syncWithStorage();
    $("#holdTime").addEventListener("input", function () {
        return storage.set({
            holdTime: parseFloat($("#holdTime").value),
        }, catchError());
    });
    $("#cooldown").addEventListener("input", function () {
        return storage.set({
            cooldown: parseFloat($("#cooldown").value),
        }, catchError());
    });
    $("#dimming").addEventListener("input", function () {
        return storage.set({
            backdropOpacity: parseFloat($("#dimming").value) / 100,
        }, catchError());
    });
    $("#explanation").addEventListener("input", function () {
        return storage.set({
            defaultExplanation: $("#explanation").value,
        }, catchError());
    });
    // functions area
    function syncWithStorage() {
        storage.get({
            sites: [],
            holdTime: 2,
            cooldown: 5,
            backdropOpacity: 0.8,
            defaultExplanation: "Default",
        }, catchError(function (args) {
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
        }));
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
            return storage.set({
                sites: sites,
            }, catchError());
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
                storage.set({
                    sites: sites,
                }, catchError());
                // delete the parent element of the button, which is the div.siteContainer
                b.target.parentElement.remove();
            });
        }
        else if (existOrNew === "new") {
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
                let explanationInputElement = e.target.parentElement.querySelector(".explanationInput");
                if (e.target.checked && explanationInputElement) {
                    explanationInputElement.remove();
                }
            };
            defExpCheckBox.addEventListener("change", handleCheckboxChange);
            button = createAddButton();
            let handleAddingSite = function (b) {
                var _a;
                // remove the site from the storage
                let site = b.target.parentElement.querySelector("input").value;
                let checkbox = b.target.parentElement.querySelector("input[type=checkbox]");
                let explanation = ((_a = b.target.parentElement.querySelector(".explanationInput")) === null || _a === void 0 ? void 0 : _a.value) ||
                    "";
                sites.push({
                    hostSuffix: site,
                    useDefaultExplanation: checkbox.checked,
                    explanation: explanation,
                });
                storage.set({
                    sites: sites,
                }, catchError());
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/options2.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uczIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSwwRkFBMEY7QUFDMUYsY0FBYztBQUVkLENBQUM7SUFDQyxJQUFJLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDMUIsT0FBTztZQUNMLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDN0IsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEQsQ0FBQztpQkFBTSxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNiLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbEMsQ0FBQztRQUNILENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztJQUVGLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ2xDLCtEQUErRDtJQUMvRCxlQUFlLEVBQUUsQ0FBQztJQUVsQixDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO1FBQ3ZDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FDaEI7WUFDRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDM0MsRUFDRCxVQUFVLEVBQUUsQ0FDYixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO1FBQ3ZDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FDaEI7WUFDRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDM0MsRUFDRCxVQUFVLEVBQUUsQ0FDYixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO1FBQ3RDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FDaEI7WUFDRSxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHO1NBQ3ZELEVBQ0QsVUFBVSxFQUFFLENBQ2IsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRTtRQUMxQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQ2hCO1lBQ0Usa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUs7U0FDNUMsRUFDRCxVQUFVLEVBQUUsQ0FDYixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxpQkFBaUI7SUFDakIsU0FBUyxlQUFlO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQ1Q7WUFDRSxLQUFLLEVBQUUsRUFBRTtZQUNULFFBQVEsRUFBRSxDQUFDO1lBQ1gsUUFBUSxFQUFFLENBQUM7WUFDWCxlQUFlLEVBQUUsR0FBRztZQUNwQixrQkFBa0IsRUFBRSxTQUFTO1NBQzlCLEVBQ0QsVUFBVSxDQUFDLFVBQVUsSUFBSTtZQUN2QixzR0FBc0c7WUFDdEcsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUV2QiwwREFBMEQ7WUFDMUQsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO2dCQUNuQixJQUFJLElBQUksQ0FBQztnQkFDVCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3RDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDO2dCQUVELE9BQU8sT0FBTyxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWhCLDZCQUE2QjtZQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN0QyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3RDLENBQUM7WUFFRCxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUN4QixnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUM7WUFFRixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRXZELGdFQUFnRTtZQUNoRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDckMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1lBRWxELE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQyxDQUNILENBQUM7UUFFRixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO1lBQ3BDLElBQUksSUFBSSxDQUFDO1lBRVQsSUFBSSxLQUFLLEdBQUcsQ0FBQztnQkFDWCxJQUFJLEdBQUcsRUFBRSxPQUFPLENBQUM7Z0JBQ2pCLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDcEMsT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUNwQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNkLElBQUksSUFBSSxFQUFFLENBQUM7d0JBQ1QsT0FBTyxDQUFDLElBQUksQ0FBQzs0QkFDWCxVQUFVLEVBQUUsSUFBSTt5QkFDakIsQ0FBQyxDQUFDO29CQUNMLENBQUM7Z0JBQ0gsQ0FBQztnQkFDRCxPQUFPLE9BQU8sQ0FBQztZQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDO1lBRUwsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUNoQjtnQkFDRSxLQUFLLEVBQUUsS0FBSzthQUNiLEVBQ0QsVUFBVSxFQUFFLENBQ2IsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxVQUFVO1FBQzVDLElBQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEQsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFN0MsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRCxTQUFTLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV2QyxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JELHFCQUFxQixDQUFDLGNBQWMsRUFBRTtZQUNwQyxJQUFJLEVBQUUsVUFBVTtZQUNoQix1QkFBdUI7WUFDdkIsSUFBSSxFQUFFLGdCQUFnQjtZQUN0QixLQUFLLEVBQUUsMkJBQTJCO1NBQ25DLENBQUMsQ0FBQztRQUVILElBQUksTUFBTSxDQUFDO1FBRVgsSUFBSSxnQkFBZ0IsQ0FBQztRQUVyQixJQUFJLFVBQVUsS0FBSyxPQUFPLEVBQUUsQ0FBQztZQUMzQixzQ0FBc0M7WUFDdEMsU0FBUyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JELGNBQWMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDO1lBQ3hELGNBQWMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBRS9CLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzVCLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25ELGdCQUFnQixDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7Z0JBQy9CLGdCQUFnQixDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO2dCQUM5QyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxnQkFBZ0IsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ25DLENBQUM7WUFFRCxNQUFNLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQztZQUM5QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQztnQkFDMUMsbUNBQW1DO2dCQUNuQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FDVDtvQkFDRSxLQUFLLEVBQUUsS0FBSztpQkFDYixFQUNELFVBQVUsRUFBRSxDQUNiLENBQUM7Z0JBQ0YsMEVBQTBFO2dCQUMxRSxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7YUFBTSxJQUFJLFVBQVUsS0FBSyxLQUFLLEVBQUUsQ0FBQztZQUNoQyxxQkFBcUI7WUFDckIsY0FBYyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDOUIsSUFBSSxvQkFBb0IsR0FBRyxVQUFVLENBQUM7Z0JBQ3BDLHVFQUF1RTtnQkFDdkUsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3RCLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ25ELGdCQUFnQixDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7b0JBQy9CLGdCQUFnQixDQUFDLFdBQVcsR0FBRyw4QkFBOEIsQ0FBQztvQkFDOUQsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztvQkFDckQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ3ZELENBQUM7Z0JBQ0QsSUFBSSx1QkFBdUIsR0FDekIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBRTVELElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksdUJBQXVCLEVBQUUsQ0FBQztvQkFDaEQsdUJBQXVCLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ25DLENBQUM7WUFDSCxDQUFDLENBQUM7WUFDRixjQUFjLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFFaEUsTUFBTSxHQUFHLGVBQWUsRUFBRSxDQUFDO1lBQzNCLElBQUksZ0JBQWdCLEdBQUcsVUFBVSxDQUFDOztnQkFDaEMsbUNBQW1DO2dCQUNuQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUMvRCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQ2pELHNCQUFzQixDQUN2QixDQUFDO2dCQUNGLElBQUksV0FBVyxHQUNiLFFBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQywwQ0FBRSxLQUFLO29CQUNoRSxFQUFFLENBQUM7Z0JBRUwsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFDVCxVQUFVLEVBQUUsSUFBSTtvQkFDaEIscUJBQXFCLEVBQUUsUUFBUSxDQUFDLE9BQU87b0JBQ3ZDLFdBQVcsRUFBRSxXQUFXO2lCQUN6QixDQUFDLENBQUM7Z0JBRUgsT0FBTyxDQUFDLEdBQUcsQ0FDVDtvQkFDRSxLQUFLLEVBQUUsS0FBSztpQkFDYixFQUNELFVBQVUsRUFBRSxDQUNiLENBQUM7Z0JBQ0YsMEVBQTBFO2dCQUMxRSxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDaEMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQztZQUVGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRUQsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwRCxhQUFhLENBQUMsU0FBUyxHQUFHLDBCQUEwQixDQUFDO1FBQ3JELGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRTdDLGFBQWEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxhQUFhLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekMsMEVBQTBFO1FBQzFFLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztZQUNyQixhQUFhLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUNELENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsU0FBUyxrQkFBa0I7UUFDekIsaUNBQWlDO1FBQ2pDLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEQsWUFBWSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7UUFDcEMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0MsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELFNBQVMsZUFBZTtRQUN0QixpQ0FBaUM7UUFDakMsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxTQUFTLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUM5QixTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyQyxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsU0FBUyxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsVUFBVTtRQUNoRCxLQUFLLElBQUksR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdDLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7OztVRXRRZDtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXJleW91c3VyZS11cGRhdGVkLy4vc3JjL29wdGlvbnMyLnRzIiwid2VicGFjazovL2FyZXlvdXN1cmUtdXBkYXRlZC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2FyZXlvdXN1cmUtdXBkYXRlZC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vYXJleW91c3VyZS11cGRhdGVkL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBvcHRpb25zIHBhZ2UgdXJsOiBjaHJvbWUtZXh0ZW5zaW9uOi8vampwZGliZ29iaW1naW1pcGpjZ2pvaXBsbWFvY2RkaHAvc3JjL29wdGlvbnMyLmh0bWxcclxuLy8gQHRzLW5vY2hlY2tcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGNhdGNoRXJyb3IgPSBmdW5jdGlvbiAoZikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xyXG4gICAgICAgIHJldHVybiBhbGVydChjaHJvbWUucnVudGltZS5sYXN0RXJyb3Iuc3RyaW5nKTtcclxuICAgICAgfSBlbHNlIGlmIChmKSB7XHJcbiAgICAgICAgcmV0dXJuIGYuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICBsZXQgJCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IuYmluZChkb2N1bWVudCk7XHJcbiAgbGV0IHN0b3JhZ2UgPSBjaHJvbWUuc3RvcmFnZS5zeW5jO1xyXG4gIC8vIEdldCB0aGUgdmFsdWVzIGN1cnJlbnRseSBpbiB0aGUgc3RvcmFnZSwgYW5kIGJ1aWxkIHRoZSBwYWdlLlxyXG4gIHN5bmNXaXRoU3RvcmFnZSgpO1xyXG5cclxuICAkKFwiI2hvbGRUaW1lXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gc3RvcmFnZS5zZXQoXHJcbiAgICAgIHtcclxuICAgICAgICBob2xkVGltZTogcGFyc2VGbG9hdCgkKFwiI2hvbGRUaW1lXCIpLnZhbHVlKSxcclxuICAgICAgfSxcclxuICAgICAgY2F0Y2hFcnJvcigpXHJcbiAgICApO1xyXG4gIH0pO1xyXG5cclxuICAkKFwiI2Nvb2xkb3duXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gc3RvcmFnZS5zZXQoXHJcbiAgICAgIHtcclxuICAgICAgICBjb29sZG93bjogcGFyc2VGbG9hdCgkKFwiI2Nvb2xkb3duXCIpLnZhbHVlKSxcclxuICAgICAgfSxcclxuICAgICAgY2F0Y2hFcnJvcigpXHJcbiAgICApO1xyXG4gIH0pO1xyXG5cclxuICAkKFwiI2RpbW1pbmdcIikuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBzdG9yYWdlLnNldChcclxuICAgICAge1xyXG4gICAgICAgIGJhY2tkcm9wT3BhY2l0eTogcGFyc2VGbG9hdCgkKFwiI2RpbW1pbmdcIikudmFsdWUpIC8gMTAwLFxyXG4gICAgICB9LFxyXG4gICAgICBjYXRjaEVycm9yKClcclxuICAgICk7XHJcbiAgfSk7XHJcblxyXG4gICQoXCIjZXhwbGFuYXRpb25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBzdG9yYWdlLnNldChcclxuICAgICAge1xyXG4gICAgICAgIGRlZmF1bHRFeHBsYW5hdGlvbjogJChcIiNleHBsYW5hdGlvblwiKS52YWx1ZSxcclxuICAgICAgfSxcclxuICAgICAgY2F0Y2hFcnJvcigpXHJcbiAgICApO1xyXG4gIH0pO1xyXG5cclxuICAvLyBmdW5jdGlvbnMgYXJlYVxyXG4gIGZ1bmN0aW9uIHN5bmNXaXRoU3RvcmFnZSgpIHtcclxuICAgIHN0b3JhZ2UuZ2V0KFxyXG4gICAgICB7XHJcbiAgICAgICAgc2l0ZXM6IFtdLFxyXG4gICAgICAgIGhvbGRUaW1lOiAyLFxyXG4gICAgICAgIGNvb2xkb3duOiA1LFxyXG4gICAgICAgIGJhY2tkcm9wT3BhY2l0eTogMC44LFxyXG4gICAgICAgIGRlZmF1bHRFeHBsYW5hdGlvbjogXCJEZWZhdWx0XCIsXHJcbiAgICAgIH0sXHJcbiAgICAgIGNhdGNoRXJyb3IoZnVuY3Rpb24gKGFyZ3MpIHtcclxuICAgICAgICAvLyBHZXQgdGhlIHNpdGVzIGZyb20gdGhlIHN0b3JhZ2UsIHRoZSBzaXRlcyBvYmplY3Qgd2lsbCBiZSBhY2Nlc3NpYmxlIGZvciBhbGwgZnVuY3Rpb25zIGluIHRoaXMgc2NvcGVcclxuICAgICAgICBsZXQgc2l0ZXMgPSBhcmdzLnNpdGVzO1xyXG5cclxuICAgICAgICAvLyBTZXQgdGhlIHNpdGVzIHRleHQgYXJlYSB3aXRoIHRoZSBzaXRlcyBmcm9tIHRoZSBzdG9yYWdlXHJcbiAgICAgICAgJChcIiNzaXRlc1wiKS52YWx1ZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBsZXQgc2l0ZTtcclxuICAgICAgICAgIGxldCByZXN1bHRzID0gW107XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpdGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHNpdGUgPSBzaXRlc1tpXTtcclxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHNpdGUuaG9zdFN1ZmZpeCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICAgICAgfSkoKS5qb2luKFwiXFxuXCIpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIHNpdGUgY29udGFpbmVyc1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGFkZFNpdGVDb250YWluZXIoc2l0ZXMsIGksIFwiZXhpc3RcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaGFuZGxlQWRkU2l0ZSA9IChlKSA9PiB7XHJcbiAgICAgICAgICBhZGRTaXRlQ29udGFpbmVyKHNpdGVzLCBzaXRlcy5sZW5ndGgsIFwibmV3XCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICQoXCIjYWRkU2l0ZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQWRkU2l0ZSk7XHJcblxyXG4gICAgICAgIC8vIFNldCB0aGUgb3RoZXIgaW5wdXQgZWxlbWVudHMgd2l0aCB0aGUgdmFsdWVzIGZyb20gdGhlIHN0b3JhZ2VcclxuICAgICAgICAkKFwiI2hvbGRUaW1lXCIpLnZhbHVlID0gYXJncy5ob2xkVGltZTtcclxuICAgICAgICAkKFwiI2Nvb2xkb3duXCIpLnZhbHVlID0gYXJncy5jb29sZG93bjtcclxuICAgICAgICAkKFwiI2V4cGxhbmF0aW9uXCIpLnZhbHVlID0gYXJncy5kZWZhdWx0RXhwbGFuYXRpb247XHJcblxyXG4gICAgICAgIHJldHVybiAoJChcIiNkaW1taW5nXCIpLnZhbHVlID0gTWF0aC5yb3VuZChhcmdzLmJhY2tkcm9wT3BhY2l0eSAqIDEwMCkpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuXHJcbiAgICAkKFwiI3NpdGVzXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCBzaXRlO1xyXG5cclxuICAgICAgbGV0IHNpdGVzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmVmLCByZXN1bHRzO1xyXG4gICAgICAgIHJlZiA9ICQoXCIjc2l0ZXNcIikudmFsdWUuc3BsaXQoXCJcXG5cIik7XHJcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVmLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBzaXRlID0gcmVmW2ldO1xyXG4gICAgICAgICAgaWYgKHNpdGUpIHtcclxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcclxuICAgICAgICAgICAgICBob3N0U3VmZml4OiBzaXRlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICAgIH0pKCk7XHJcblxyXG4gICAgICByZXR1cm4gc3RvcmFnZS5zZXQoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgc2l0ZXM6IHNpdGVzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2F0Y2hFcnJvcigpXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZFNpdGVDb250YWluZXIoc2l0ZXMsIGksIGV4aXN0T3JOZXcpIHtcclxuICAgIGxldCBzaXRlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHNpdGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInNpdGVDb250YWluZXJcIik7XHJcblxyXG4gICAgbGV0IHNpdGVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIHNpdGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dFwiKTtcclxuXHJcbiAgICBsZXQgZGVmRXhwQ2hlY2tCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBzZXRNdWx0aXBsZUF0dHJpYnV0ZXMoZGVmRXhwQ2hlY2tCb3gsIHtcclxuICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxyXG4gICAgICAvL2lkOiBcImRlZkV4cENoZWNrQm94XCIsXHJcbiAgICAgIG5hbWU6IFwiZGVmRXhwQ2hlY2tCb3hcIixcclxuICAgICAgdmFsdWU6IFwiVXNlciBkZWZhdWx0IGV4cGxhbmF0aW9uP1wiLFxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGJ1dHRvbjtcclxuXHJcbiAgICBsZXQgZXhwbGFuYXRpb25JbnB1dDtcclxuXHJcbiAgICBpZiAoZXhpc3RPck5ldyA9PT0gXCJleGlzdFwiKSB7XHJcbiAgICAgIC8vIHNldCB0aGUgdmFsdWVzIGFjY29yZGluZyB0byBzdG9yYWdlXHJcbiAgICAgIHNpdGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBzaXRlc1tpXS5ob3N0U3VmZml4KTtcclxuICAgICAgZGVmRXhwQ2hlY2tCb3guY2hlY2tlZCA9IHNpdGVzW2ldLnVzZURlZmF1bHRFeHBsYW5hdGlvbjtcclxuICAgICAgZGVmRXhwQ2hlY2tCb3guZGlzYWJsZWQgPSB0cnVlO1xyXG5cclxuICAgICAgaWYgKCFkZWZFeHBDaGVja0JveC5jaGVja2VkKSB7XHJcbiAgICAgICAgZXhwbGFuYXRpb25JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBleHBsYW5hdGlvbklucHV0LnR5cGUgPSBcInRleHRcIjtcclxuICAgICAgICBleHBsYW5hdGlvbklucHV0LnZhbHVlID0gc2l0ZXNbaV0uZXhwbGFuYXRpb247XHJcbiAgICAgICAgZXhwbGFuYXRpb25JbnB1dC5jbGFzc0xpc3QuYWRkKFtcImV4cGxhbmF0aW9uSW5wdXRcIl0pO1xyXG4gICAgICAgIGV4cGxhbmF0aW9uSW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBidXR0b24gPSBjcmVhdGVEZWxldGVCdXR0b24oKTtcclxuICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoYikge1xyXG4gICAgICAgIC8vIHJlbW92ZSB0aGUgc2l0ZSBmcm9tIHRoZSBzdG9yYWdlXHJcbiAgICAgICAgc2l0ZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIHN0b3JhZ2Uuc2V0KFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzaXRlczogc2l0ZXMsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2F0Y2hFcnJvcigpXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBkZWxldGUgdGhlIHBhcmVudCBlbGVtZW50IG9mIHRoZSBidXR0b24sIHdoaWNoIGlzIHRoZSBkaXYuc2l0ZUNvbnRhaW5lclxyXG4gICAgICAgIGIudGFyZ2V0LnBhcmVudEVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChleGlzdE9yTmV3ID09PSBcIm5ld1wiKSB7XHJcbiAgICAgIC8vIHVzZSBkZWZhdWx0IHZhbHVlc1xyXG4gICAgICBkZWZFeHBDaGVja0JveC5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgbGV0IGhhbmRsZUNoZWNrYm94Q2hhbmdlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvLyBpZiB0aGUgY2hlY2tib3ggaXMgY2hlY2tlZCwgY3JlYXRlIGFub3RoZXIgaW5wdXQgZm9yIHRoZSBleHBsYW5hdGlvblxyXG4gICAgICAgIGlmICghZS50YXJnZXQuY2hlY2tlZCkge1xyXG4gICAgICAgICAgZXhwbGFuYXRpb25JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICAgIGV4cGxhbmF0aW9uSW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgICAgZXhwbGFuYXRpb25JbnB1dC5wbGFjZWhvbGRlciA9IFwiSW5zZXJ0IGhlcmUgeW91ciBleHBsYW5hdGlvblwiO1xyXG4gICAgICAgICAgZXhwbGFuYXRpb25JbnB1dC5jbGFzc0xpc3QuYWRkKFtcImV4cGxhbmF0aW9uSW5wdXRcIl0pO1xyXG4gICAgICAgICAgZS50YXJnZXQucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChleHBsYW5hdGlvbklucHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGV4cGxhbmF0aW9uSW5wdXRFbGVtZW50ID1cclxuICAgICAgICAgIGUudGFyZ2V0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5leHBsYW5hdGlvbklucHV0XCIpO1xyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQuY2hlY2tlZCAmJiBleHBsYW5hdGlvbklucHV0RWxlbWVudCkge1xyXG4gICAgICAgICAgZXhwbGFuYXRpb25JbnB1dEVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgICBkZWZFeHBDaGVja0JveC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGhhbmRsZUNoZWNrYm94Q2hhbmdlKTtcclxuXHJcbiAgICAgIGJ1dHRvbiA9IGNyZWF0ZUFkZEJ1dHRvbigpO1xyXG4gICAgICBsZXQgaGFuZGxlQWRkaW5nU2l0ZSA9IGZ1bmN0aW9uIChiKSB7XHJcbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBzaXRlIGZyb20gdGhlIHN0b3JhZ2VcclxuICAgICAgICBsZXQgc2l0ZSA9IGIudGFyZ2V0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLnZhbHVlO1xyXG4gICAgICAgIGxldCBjaGVja2JveCA9IGIudGFyZ2V0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgIFwiaW5wdXRbdHlwZT1jaGVja2JveF1cIlxyXG4gICAgICAgICk7XHJcbiAgICAgICAgbGV0IGV4cGxhbmF0aW9uID1cclxuICAgICAgICAgIGIudGFyZ2V0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5leHBsYW5hdGlvbklucHV0XCIpPy52YWx1ZSB8fFxyXG4gICAgICAgICAgXCJcIjtcclxuXHJcbiAgICAgICAgc2l0ZXMucHVzaCh7XHJcbiAgICAgICAgICBob3N0U3VmZml4OiBzaXRlLFxyXG4gICAgICAgICAgdXNlRGVmYXVsdEV4cGxhbmF0aW9uOiBjaGVja2JveC5jaGVja2VkLFxyXG4gICAgICAgICAgZXhwbGFuYXRpb246IGV4cGxhbmF0aW9uLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdG9yYWdlLnNldChcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc2l0ZXM6IHNpdGVzLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNhdGNoRXJyb3IoKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy8gZGVsZXRlIHRoZSBwYXJlbnQgZWxlbWVudCBvZiB0aGUgYnV0dG9uLCB3aGljaCBpcyB0aGUgZGl2LnNpdGVDb250YWluZXJcclxuICAgICAgICBiLnRhcmdldC5wYXJlbnRFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIGFkZFNpdGVDb250YWluZXIoc2l0ZXMsIHNpdGVzLmxlbmd0aCAtIDEsIFwiZXhpc3RcIik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUFkZGluZ1NpdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBjaGVja2JveExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgY2hlY2tib3hMYWJlbC5pbm5lckhUTUwgPSBcIlVzZSBkZWZhdWx0IGV4cGxhbmF0aW9uP1wiO1xyXG4gICAgY2hlY2tib3hMYWJlbC5jbGFzc0xpc3QuYWRkKFwiY2hlY2tib3hMYWJlbFwiKTtcclxuXHJcbiAgICBzaXRlQ29udGFpbmVyLmFwcGVuZENoaWxkKHNpdGVJbnB1dCk7XHJcbiAgICBzaXRlQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XHJcbiAgICBzaXRlQ29udGFpbmVyLmFwcGVuZENoaWxkKGRlZkV4cENoZWNrQm94KTtcclxuICAgIHNpdGVDb250YWluZXIuYXBwZW5kQ2hpbGQoY2hlY2tib3hMYWJlbCk7XHJcbiAgICAvLyBJZiB0aGUgZXhwYWxuYXRpb24gaW5wdXQgZXhpc3QsIHRoZW4gd2Ugd2FudCB0byBhZGQgaXQgdG8gdGhlIGNvbnRhaW5lclxyXG4gICAgaWYgKGV4cGxhbmF0aW9uSW5wdXQpIHtcclxuICAgICAgc2l0ZUNvbnRhaW5lci5hcHBlbmRDaGlsZChleHBsYW5hdGlvbklucHV0KTtcclxuICAgIH1cclxuICAgICQoXCIjc2l0ZXNDb250YWluZXJcIikuYXBwZW5kQ2hpbGQoc2l0ZUNvbnRhaW5lcik7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVEZWxldGVCdXR0b24oKSB7XHJcbiAgICAvLyBjcmVhdGUgYSBidXR0b24gd2l0aCBhbiBYIGljb25cclxuICAgIGxldCBkZWxldGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgZGVsZXRlQnV0dG9uLmlubmVySFRNTCA9IFwiJiMxMDAwNjtcIjtcclxuICAgIGRlbGV0ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZGVsZXRlQnV0dG9uXCIpO1xyXG4gICAgcmV0dXJuIGRlbGV0ZUJ1dHRvbjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUFkZEJ1dHRvbigpIHtcclxuICAgIC8vIGNyZWF0ZSBhIGJ1dHRvbiB3aXRoIGFuIFggaWNvblxyXG4gICAgbGV0IGFkZEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBhZGRCdXR0b24uaW5uZXJIVE1MID0gXCImIzQzO1wiO1xyXG4gICAgYWRkQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhZGRCdXR0b25cIik7XHJcbiAgICByZXR1cm4gYWRkQnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0TXVsdGlwbGVBdHRyaWJ1dGVzKGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcclxuICAgIGZvciAobGV0IGtleSBpbiBhdHRyaWJ1dGVzKSB7XHJcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlc1trZXldKTtcclxuICAgIH1cclxuICB9XHJcbn0pLmNhbGwodGhpcyk7XHJcbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9zcmMvb3B0aW9uczIudHNcIl0oKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==