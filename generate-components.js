let fs = require('fs');

if (!fs.existsSync('./src/app/components')) {
	fs.mkdirSync('./src/app/components');
}

const MAX_DEPTH = 4;
const N = 4;

const files = [];
let fi = 0;

function createFileTree(root, importRoot, depth) {
	if (depth == MAX_DEPTH) {
		for (let i = 0; i < N; i++) {
			fs.writeFileSync(`${root}/component-${fi}.ts`, `
				import { Component } from '@angular/core';

				@Component({
					selector: 'app-component-${fi}',
					template: '<div></div>',
					styles: []
				})
				export class Component${fi} {
					title = 'component-${fi}';
				}
			`);

			files.push({
				path: `${importRoot}/component-${fi}`,
				name: `Component${fi}`
			});

			fi++;
		}
		return;
	}

	for (let i = 0; i < N; i++) {
		if (!fs.existsSync(`${root}/${i}`)) {
			fs.mkdirSync(`${root}/${i}`);
		}

		createFileTree(`${root}/${i}`, `${importRoot}/${i}`, depth + 1);
	}
}

createFileTree('./src/app/components', './components', 0);

fs.writeFileSync('./src/app/app.module.ts', `
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

${files.map(file => `import { ${file.name} } from '${file.path}'`).join('\n')}

@NgModule({
  declarations: [
	AppComponent,
	${files.map(file => `${file.name},`).join('\n')}
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
`);
