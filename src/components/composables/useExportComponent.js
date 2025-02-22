export function useExportComponent() {
    // OVERVUE 6.0: export active component 
    /**
     * @description: makes files, directories and boilerplate when exporting a single Vue component
     * 
     * @param: none -- uses this.activeComponent from state to create file
     * @return: none -- outputs file to fs
     * 
     */
    
      const showExportComponentDialog = () => {
        ipcRenderer
        .invoke("exportComponent", {
          title: "Choose location to save folder in",
          message: "Choose location to save folder in",
          nameFieldLabel: "Component Name",
        })
        .then((result) => exportComponentFile(result.filePath))
        .catch((err) => console.log(err));
      }
      
      /**
       * @description: creates component code <template>, <script>, <style>
       * invokes writeTemplate, writeScript, writeStyle
       */
      
      const createComponentCode = (componentLocation, componentName, children) => {
        fs.writeFileSync(
          componentLocation + ".vue",
            writeComments(componentName) +
            writeTemplate(componentName, children) +
            writeScript(componentName, children) +
            writeStyle(componentName)
        );
      }

      const writeTemplateTag = (componentName) => {
        // create reference object
        const htmlElementMap = {
          div: ["<div>", "</div>"],
          button: ["<button>", "</button>"],
          form: ["<form>", "</form>"],
          img: ["<img>", ""],
          link: ['<a href="#"/>', ""],
          list: ["<li>", "</li>"],
          paragraph: ["<p>", "</p>"],
          "list-ol": ["<ol>", "</ol>"],
          "list-ul": ["<ul>", "</ul>"],
          input: ["<input />", ""],
          navbar: ["<nav>", "</nav>"],
        };
        // function to loop through nested elements
        const writeNested = (childrenArray, indent) => {
          if (!childrenArray.length) {
            return "";
          }
          let indented = indent + "  ";
          let nestedString = "";
          childrenArray.forEach((child) => {
            nestedString += indented;
            if (!child.text) {
              nestedString += `<${child}/>\n`;
            } else {
              if (child.children.length) {
                nestedString += htmlElementMap[child.text][0];
                nestedString += "\n";
                nestedString += writeNested(child.children, indented);
                nestedString += indented + htmlElementMap[child.text][1];
                nestedString += "\n";
              } else {
                nestedString +=
                  htmlElementMap[child.text][0] +
                  htmlElementMap[child.text][1] +
                  "\n";
              }
            }
          });
          return nestedString;
        }
        // iterate through component's htmllist
        let htmlArr = this.componentMap[componentName].htmlList;
        let outputStr = ``;
        // eslint-disable-next-line no-unused-vars
        for (let el of htmlArr) {
          if (!el.text) {
            outputStr += `    <${el}/>\n`;
          } else {
            outputStr += `    `;
            if (el.children.length) {
              outputStr += htmlElementMap[el.text][0];
              outputStr += "\n";
              outputStr += writeNested(el.children, `    `);
              outputStr += `    `;
              outputStr += htmlElementMap[el.text][1];
              outputStr += `  \n`;
            } else {
              outputStr +=
                htmlElementMap[el.text][0] + htmlElementMap[el.text][1] + "\n";
            }
          }
        }
        return outputStr;
      }

      const writeComments = (componentName) => {
        if (this.componentMap[componentName]?.noteList?.length > 0){
          let commentStr = '<!--'
          this.componentMap[componentName].noteList.forEach((el)=>{
            commentStr += "\n"
            commentStr += el;
          })
          commentStr += '\n-->\n\n'
          return commentStr;
        }
      }

      /**
       * @description creates the <router-link> boilerplate for /views/components
       * also creates the <template></template> tag for each component
       */
      const writeTemplate = (componentName, children) => {
        let str = "";
        str += `<div>\n`;
        // writes the HTML tag boilerplate
        let templateTagStr = writeTemplateTag(componentName);
        return `<template>\n\t${str}${templateTagStr}\t</div>\n</template>`;
      }

      /**
       * @description imports child components into <script>
       */
      const writeScript = (componentName, children) => {
        // add import mapstate and mapactions if they exist
        const currentComponent = this.componentMap[componentName];
        let imports = "";
        if (currentComponent.actions.length || currentComponent.state.length) {
          imports += "import { ";
          if (currentComponent.actions.length && currentComponent.state.length) {
            imports += "mapState, mapActions";
          } else if (currentComponent.state.length) imports += "mapState";
          else imports += "mapActions";
          imports += ' } from "vuex"\n';
        }
        // if Typescript toggle is on, import defineComponent
        if (this.exportAsTypescript === "on") {
          imports += 'import { defineComponent } from "vue";\n';
        }
        // add imports for children
        children.forEach((name) => {
          imports += `import ${name} from '@/components/${name}.vue';\n`;
        });
        // add components section

        // if true add data section and populate with props
        let childrenComponentNames = "";
        children.forEach((name) => {
          childrenComponentNames += `    ${name},\n`;
        });
        // if true add data section and populate with props
        let data = "";
        if (currentComponent.props.length) {
          data += "  data () {\n    return {";
          currentComponent.props.forEach((prop) => {
            data += `\n      ${prop}: "PLACEHOLDER FOR VALUE",`;
          });
          data += "\n";
          data += "    }\n";
          data += "  },\n";
        }
        // if true add computed section and populate with state
        let computed = "";
        if (currentComponent.state.length) {
          computed += "  computed: {";
          computed += "\n    ...mapState([";
          currentComponent.state.forEach((state) => {
            computed += `\n      "${state}",`;
          });
          computed += "\n    ]),\n";
          computed += "  },\n";
        }
        // if true add methods section and populate with actions
        let methods = "";
        if (currentComponent.actions.length) {
          methods += "  methods: {";
          methods += "\n    ...mapActions([";
          currentComponent.actions.forEach((action) => {
            methods += `\n      "${action}",`;
          });
          methods += "\n    ]),\n";
          methods += "  },\n";
        }
        // concat all code within script tags
        // if exportAsTypescript is on, out should be <script lang="ts">
        let output;
        if (this.exportAsTypescript === "on") {
          output = "\n\n<script lang='ts'>\n";
          output += imports + "\nexport default defineComponent ({\n  name: '" + componentName + "'";
        } else {
          output = "\n\n<script>\n";
          output += imports + "\nexport default {\n  name: '" + componentName + "'";
        }
        output += ",\n  components: {\n";
        output += childrenComponentNames + "  },\n";
        output += data;
        output += computed;
        output += methods;
        // eslint-disable-next-line no-useless-escape
        if (this.exportAsTypescript === "on") {
          output += "});\n<\/script>";

        } else {
          output += "};\n<\/script>";
        }
        return output;
      }

      /**
       * @description writes the <style> in vue component
       * if component is 'App', writes css, else returns <style scoped>
       */
      const writeStyle = (componentName) => {
        return `\n\n<style scoped>\n</style>`;
      }

      const exportComponentFile = (data) => {
        if (data === undefined) return;
        if (!fs.existsSync(data)) {
          fs.mkdirSync(data);
        }
        // main logic below for creating single component
        // eslint-disable-next-line no-unused-vars
        createComponentCode(
          path.join(data, this.activeComponent),
          this.activeComponent,
          this.componentMap[this.activeComponent].children
        );
      }
      showExportComponentDialog();
  }