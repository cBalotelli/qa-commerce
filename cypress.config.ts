import { defineConfig } from "cypress";
import fs from "fs-extra";
import path from "path";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  video: true,
  e2e: {
    baseUrl: "http://localhost:3000", 
    
    specPattern: "cypress/e2e/features/**/*.feature",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      
      on("file:preprocessor", createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));

      on('after:spec', (spec, results) => {
        if (results && results.video) {
          const videoPath = results.video;
          const dataPasta = new Date().toISOString().split('T')[0];
          const baseEvidencias = path.join('cypress', 'evidencias', dataPasta);
          
          const categoria = spec.relative.includes('Backend') ? 'Backend' : 'Frontend';
          const novaPasta = path.join(baseEvidencias, categoria);
          
          if (!fs.existsSync(novaPasta)) fs.mkdirSync(novaPasta, { recursive: true });

          const time = new Date();
          const timestamp = `${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}`;
          const nomeFeature = path.basename(spec.name, '.feature');
          const destino = path.join(novaPasta, `${nomeFeature}_${timestamp}.mp4`);

          fs.renameSync(videoPath, destino);
        }
      });
      return config;
    },
  },
});