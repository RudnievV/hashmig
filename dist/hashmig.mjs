#!/usr/bin/env node
import e from"dotenv";import r from"prompts";import{Command as n}from"commander";import*as t from"fs";import i from"fs";import o from"mysql2";import s from"kleur";import c from"crypto";import{z as a}from"zod";import u from"@rsol/pipe";function l(){return l=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var n=arguments[r];for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(e[t]=n[t])}return e},l.apply(this,arguments)}function f(e,r){(null==r||r>e.length)&&(r=e.length);for(var n=0,t=new Array(r);n<r;n++)t[n]=e[n];return t}function h(e,r){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,r){if(e){if("string"==typeof e)return f(e,r);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(e,r):void 0}}(e))||r&&e&&"number"==typeof e.length){n&&(e=n);var t=0;return function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}e.config();var g=/*#__PURE__*/function(){function e(e){this.conn=void 0,this.connect(e)}var r=e.prototype;return r.connect=function(e){this.conn=o.createConnection(e)},r.query=function(e,r){try{var n=this;return Promise.resolve(new Promise(function(t,i){var o;n.conn||i("Connection is not established"),null==(o=n.conn)||o.query(e,r,function(e,r){e?i(e):t(r)})}))}catch(e){return Promise.reject(e)}},r.execute=function(e,r){try{var n=this;return Promise.resolve(new Promise(function(t,i){var o;n.conn||i("Connection is not established"),null==(o=n.conn)||o.execute(e,r,function(e,r){e?i(e):t(r)})}))}catch(e){return Promise.reject(e)}},e}(),m=/*#__PURE__*/function(){function e(e){void 0===e&&(e=!1),this.silent=!1,this.silent=e}var r=e.prototype;return r.log=function(e){!this.silent&&console.log(s.gray().italic(e))},r.info=function(e){!this.silent&&console.log(s.green().italic(e))},r.warn=function(e){!this.silent&&console.warn(s.red().italic(e))},r.error=function(e){!this.silent&&console.error(s.red().italic(e))},r.success=function(e){!this.silent&&console.log(s.bgGreen().bold(e))},e}();function d(e,r){try{var n=e()}catch(e){return r(e)}return n&&n.then?n.then(void 0,r):n}var v=/*#__PURE__*/function(){function e(e){var r;this.db=void 0,this.folder=void 0,this.database=void 0,this.table=void 0,this.logger={log:function(){},info:function(){},warn:function(){},error:function(){},success:function(){}},this.folder=(null==e?void 0:e.folder)||"./hashmig_migrations",this.table=(null==e?void 0:e.table)||"hashmig_migrations",this.database=(null==e||null==(r=e.db)?void 0:r.database)||process.env.DB_SELECT,this.initLogger(null==e?void 0:e.logger,null==e?void 0:e.silent),this.db=new g((null==e?void 0:e.db)||{port:+(process.env.DB_PORT||3306),host:process.env.DB_SERVER,database:process.env.DB_SELECT,user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,ssl:{rejectUnauthorized:!1}})}var r=e.prototype;return r.initLogger=function(e,r){r||(this.logger=this.instanceOfLoggerEngine(e||{})?e:new m)},r.instanceOfLoggerEngine=function(e){return["log","info","warn","error","success"].reduce(function(r,n){return r&&n in e},!0)},r.isMigrationsFolderExists=function(){return t.existsSync(this.folder)},r.createMigrationsFolder=function(){t.mkdirSync(this.folder)},r.getProcedures=function(){try{return Promise.resolve(this.db.query("SHOW PROCEDURE STATUS WHERE Db = '"+this.database+"'").then(function(e){return e}).then(function(e){return e.map(function(e){return{Name:e.Name,Modified:e.Modified}})}))}catch(e){return Promise.reject(e)}},r.getFunctions=function(){try{return Promise.resolve(this.db.query("SHOW FUNCTION STATUS WHERE Db = '"+this.database+"'").then(function(e){return e}).then(function(e){return e.map(function(e){return{Name:e.Name,Modified:e.Modified}})}))}catch(e){return Promise.reject(e)}},r.getProcedureSource=function(e){try{return Promise.resolve(this.db.query("SHOW CREATE PROCEDURE "+e).then(function(e){return e}).then(function(e){return e[0]["Create Procedure"]}))}catch(e){return Promise.reject(e)}},r.getFunctionSource=function(e){try{return Promise.resolve(this.db.query("SHOW CREATE FUNCTION "+e).then(function(e){return e}).then(function(e){return e[0]["Create Function"]}))}catch(e){return Promise.reject(e)}},r.isMigrationsTableExists=function(){try{return Promise.resolve(this.db.query("SHOW TABLES LIKE '"+this.table+"'").then(function(e){return e}).then(function(e){return e.length>0}))}catch(e){return Promise.reject(e)}},r.createMigrationsTable=function(){try{return Promise.resolve(this.db.query("\n        CREATE TABLE "+this.table+"\n        (\n            ID        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n            FileName  VARCHAR(255)                   NOT NULL,\n            Hash      VARCHAR(312)                   NOT NULL,\n            Type      ENUM ('procedure', 'function') NOT NULL,\n            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n        )\n    "))}catch(e){return Promise.reject(e)}},r.getMigrations=function(){try{var e=this;return Promise.resolve(e.db.query("\n      SELECT FileName, Hash, Type\n       FROM "+e.table+"\n       WHERE ID IN (\n          SELECT MAX(ID) FROM "+e.table+" GROUP BY FileName\n       )\n    "))}catch(e){return Promise.reject(e)}},r.initProcedures=function(e){try{var r=function(){t.length>0&&n.logger.error("     - migrations for procedures "+t.join(", ")+" not initialized")},n=this,t=[],i=0,o=E(e,function(e){i++;var r=d(function(){return Promise.resolve(n.initProcedure(e)).then(function(){n.logger.info("     "+i+". migration for procedure "+e+" initialized")})},function(r){t.push(e),n.logger.error("     "+i+". migration for procedure "+e+" not initialized: "+r.message)});if(r&&r.then)return r.then(function(){})});return Promise.resolve(o&&o.then?o.then(r):r())}catch(e){return Promise.reject(e)}},r.initProcedure=function(e){try{var r=this;return Promise.resolve(r.getProcedureSource(e)).then(function(n){n=n.replace(/DEFINER=`[^`]+`@`[^`]+`/,"");var i=r.getHash(n="DROP PROCEDURE IF EXISTS `"+e+"`;\n-- NEW_COMMAND\n"+n),o="p_"+e+".sql";return t.writeFileSync(r.folder+"/"+o,n),Promise.resolve(r.db.query("INSERT INTO "+r.table+" (FileName, Hash, Type)\n                         VALUES (?, ?, 'procedure')",[o,i])).then(function(){})})}catch(e){return Promise.reject(e)}},r.initFunctions=function(e){try{var r=function(){t.length>0&&n.logger.error("     - migrations for functions "+t.join(", ")+" not initialized")},n=this,t=[],i=0,o=E(e,function(e){i++;var r=d(function(){return Promise.resolve(n.initFunction(e)).then(function(){n.logger.info("     "+i+". migration for function "+e+" initialized")})},function(r){t.push(e),n.logger.error("     "+i+". migration for function "+e+" not initialized: "+r.message)});if(r&&r.then)return r.then(function(){})});return Promise.resolve(o&&o.then?o.then(r):r())}catch(e){return Promise.reject(e)}},r.initFunction=function(e){try{var r=this;return Promise.resolve(r.getFunctionSource(e)).then(function(n){n=n.replace(/DEFINER=`[^`]+`@`[^`]+`/,"");var i=r.getHash(n="DROP PROCEDURE IF EXISTS `"+e+"`;\n-- NEW_COMMAND\n"+n),o="f_"+e+".sql";return t.writeFileSync(r.folder+"/"+o,n),Promise.resolve(r.db.query("INSERT INTO "+r.table+" (FileName, Hash, Type)\n                         VALUES (?, ?, 'function')",[o,i])).then(function(){})})}catch(e){return Promise.reject(e)}},r.getHash=function(e){return function(e,r){void 0===r&&(r="_@#$^*_");var n=[],t=-1,i=e.replace(/\n/g," ").replace(/\t/g," ").replace(/\\'/g,r+"single"+r).replace(/\\"/g,r+"double"+r).replace(/'.*?'/g,function(e){return n.push(e),t++,""+r+t+r}).replace(/".*?"/g,function(e){return n.push(e),t++,""+r+t+r}).replace(/\s{2,}/g," ");return n.forEach(function(e,n){i=i.replace(""+r+n+r,e)}),c.createHash("sha256").update(i).digest("hex")}(e)},r.getMigrationsFiles=function(){try{for(var e,r=this,n=new Map,i=h(t.readdirSync(r.folder));!(e=i()).done;){var o=e.value,s=t.readFileSync(r.folder+"/"+o).toString(),c=r.getHash(s);n.set(c,o)}return Promise.resolve(n)}catch(e){return Promise.reject(e)}},r.getMigrationsToRun=function(){try{var e=this;return Promise.resolve(e.getMigrations().then(function(e){return e.reduce(function(e,r){return e.set(r.Hash,r.FileName),e},new Map)})).then(function(r){return Promise.resolve(e.getMigrationsFiles()).then(function(n){for(var t,i=h(n);!(t=i()).done;){var o=t.value,s=o[0],c=o[1];r.has(s)&&r.get(s)===c?n.delete(s):e.logger.log("     + "+c+" will be migrated")}return n})})}catch(e){return Promise.reject(e)}},r.runMigrations=function(e){try{var r=function(){t.length>0&&n.logger.error("     - migrations for files "+t.join(", ")+" not completed")},n=this,t=[],i=0,o=E(e,function(e){i++;var r=d(function(){return Promise.resolve(n.migrateFile(e)).then(function(){n.logger.info("     "+i+". migration for file "+e+" completed")})},function(r){t.push(e),n.logger.error("     "+i+". migration for file "+e+" not completed: "+r.message)});if(r&&r.then)return r.then(function(){})});return Promise.resolve(o&&o.then?o.then(r):r())}catch(e){return Promise.reject(e)}},r.migrateFile=function(e){try{var r=this,n=t.readFileSync(r.folder+"/"+e).toString(),i=r.getHash(n);return Promise.resolve(r.runFileSql(n)).then(function(){return Promise.resolve(r.db.query("INSERT INTO "+r.table+" (FileName, Hash, Type)\n                         VALUES (?, ?, 'function')",[e,i])).then(function(){})})}catch(e){return Promise.reject(e)}},r.clear=function(){try{var e=this;return Promise.resolve(e.clearDb()).then(function(){e.clearFolder()})}catch(e){return Promise.reject(e)}},r.clearDb=function(){try{var e=this;return Promise.resolve(e.db.query("DROP TABLE IF EXISTS "+e.table)).then(function(){e.logger.success("--- Migrations table dropped")})}catch(e){return Promise.reject(e)}},r.clearFolder=function(){t.rmSync(this.folder,{recursive:!0,force:!0}),this.logger.success("--- Migrations folder removed")},r.runFileSql=function(e){try{var r=this,n=e.toString().split("NEW_COMMAND");return Promise.all(n.map(function(e){return e.trim()}).filter(Boolean).map(function(e){return r.db.query(e)}))}catch(e){return Promise.reject(e)}},e}();const p="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function b(e,r,n){if(!e.s){if(n instanceof y){if(!n.s)return void(n.o=b.bind(null,e,r));1&r&&(r=n.s),n=n.v}if(n&&n.then)return void n.then(b.bind(null,e,r),b.bind(null,e,2));e.s=r,e.v=n;var t=e.o;t&&t(e)}}var y=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(r,n){var t=new e,i=this.s;if(i){var o=1&i?r:n;if(o){try{b(t,1,o(this.v))}catch(e){b(t,2,e)}return t}return this}return this.o=function(e){try{var i=e.v;1&e.s?b(t,1,r?r(i):i):n?b(t,1,n(i)):b(t,2,i)}catch(e){b(t,2,e)}},t},e}();function P(e){return e instanceof y&&1&e.s}function E(e,r,n){if("function"==typeof e[p]){var t,i,o,s=e[p]();if(function e(c){try{for(;!((t=s.next()).done||n&&n());)if((c=r(t.value))&&c.then){if(!P(c))return void c.then(e,o||(o=b.bind(null,i=new y,2)));c=c.v}i?b(i,1,c):i=c}catch(e){b(i||(i=new y),2,e)}}(),s.return){var c=function(e){try{t.done||s.return()}catch(e){}return e};if(i&&i.then)return i.then(c,function(e){throw c(e)});c()}return i}if(!("length"in e))throw new TypeError("Object is not iterable");for(var a=[],u=0;u<e.length;u++)a.push(e[u]);return function(e,r,n){var t,i,o=-1;return function s(c){try{for(;++o<e.length&&(!n||!n());)if((c=r(o))&&c.then){if(!P(c))return void c.then(s,i||(i=b.bind(null,t=new y,2)));c=c.v}t?b(t,1,c):t=c}catch(e){b(t||(t=new y),2,e)}}(),t}(a,function(e){return r(a[e])},n)}var S=/*#__PURE__*/function(){function e(){}return e.getConfig=function(e){return void 0===e&&(e="./hashmig.config.json"),this.fileName=e,this.loadConfigFromFile()||this.getConfigFromEnv()||null},e.getConfigFromEnv=function(){var e={db:{port:+(process.env.DB_PORT||3306),host:process.env.DB_SERVER,database:process.env.DB_SELECT,user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,ssl:{rejectUnauthorized:!1}},folder:process.env.HASHMIG_FOLDER||"./hashmig_migrations",table:process.env.HASHMIG_TABLE||"hashmig_migrations",silent:"true"===process.env.HASHMIG_SILENT};return this.validateAndFillConfig(e)},e.loadConfigFromFile=function(){if(!i.existsSync(""+this.fileName))return null;var e=i.readFileSync(""+this.fileName).toString();return this.validateAndFillConfig(JSON.parse(e))},e.validateAndFillConfig=function(e){var r=a.object({db:a.object({port:a.string().or(a.number()),host:a.string(),database:a.string(),user:a.string(),password:a.string(),ssl:a.object({rejectUnauthorized:a.boolean().or(a.string())})}),folder:a.string(),table:a.string(),silent:a.string().or(a.boolean())});try{var n,t,i,o,s;r.parse(e);var c=a.object({db:a.object({port:a.number(),host:a.string(),database:a.string(),user:a.string(),password:a.string(),ssl:a.object({rejectUnauthorized:a.boolean()})}),folder:a.string(),table:a.string(),silent:a.boolean()}),l=(new u).addHandler("env",function(){return function(e,r){return process.env[e]||r}}),f={db:{port:l.pipe(((null==(n=e.db)?void 0:n.port)||3306)+"|toInt"),host:l.pipe((null==(t=e.db)?void 0:t.host)||""),database:l.pipe((null==(i=e.db)?void 0:i.database)||""),user:l.pipe((null==(o=e.db)?void 0:o.user)||""),password:l.pipe((null==(s=e.db)?void 0:s.password)||""),ssl:e.db.ssl},folder:l.pipe(e.folder||""),table:l.pipe(e.table||""),silent:!0===e.silent||!1!==e.silent&&l.pipe(e.silent||"false|toBool")};return c.parse(f)}catch(e){return console.error(e),null}},e}();S.fileName="./hashmig.config.json";var M=new n,T=/*#__PURE__*/function(){function e(){var e=this,n=this,t=this,i=this,o=this;this.hashmig=void 0,this.logger=void 0,this.isInteractive=!0,this.main=function(){try{return M.name("hashmig").description("CLI migrations tool for MySQL stored procedures and functions").version("1.0.2").option("-c, --config <string>","Path to config file","./hashmig.config.json").hook("preAction",function(r){var n=r.opts();e.init(n.config)}),M.addHelpText("after","\n\nTo configure, you can use `./hashmig.config.json` (see `./hashmig.example.config.json`) file or the following environment variables:\n  DB_PORT - post number\n  DB_SERVER - server address\n  DB_SELECT - database name\n  DB_USERNAME - username\n  DB_PASSWORD - password\n  HASHMIG_FOLDER - path to folder with migrations\n  HASHMIG_TABLE - name of table with migrations\n  HASHMIG_SILENT - disable logger"),M.command("run").description("Execute migrations").option("-n, --noninteractive","Non-interactive mode",!1).action(function(r){var n=r.noninteractive;e.isInteractive=!(void 0!==n&&n);try{return Promise.resolve(e.createMigrationsTableExists()).then(function(r){return r||process.exit(0),Promise.resolve(e.createMigrationFolder()).then(function(n){function t(r){return Promise.resolve(e.runMigrations()).then(function(){process.exit(0)})}return(r=n)||process.exit(0),e.isInteractive?Promise.resolve(e.initMigrations()).then(t):t()})})}catch(e){Promise.reject(e)}}),M.command("clear").description("Clear folder and table").action(function(){try{return Promise.resolve(r({type:"toggle",name:"value",message:"Are you sure to delete table and folder?",initial:!0,active:"yes",inactive:"no"})).then(function(r){return r.value||process.exit(0),Promise.resolve(e.hashmig.clear()).then(function(){})})}catch(e){Promise.reject(e)}}),M.command("init").description("Fill table and folder by existing stored procedures and functions").action(function(){try{return Promise.resolve(e.createMigrationsTableExists()).then(function(r){return r||process.exit(0),Promise.resolve(e.createMigrationFolder()).then(function(n){return(r=n)||process.exit(0),Promise.resolve(e.initMigrations(!0)).then(function(){})})})}catch(e){Promise.reject(e)}}),M.parse(),Promise.resolve()}catch(e){return Promise.reject(e)}},this.createMigrationsTableExists=function(){try{return Promise.resolve(n.hashmig.isMigrationsTableExists()).then(function(e){return!!e||Promise.resolve(n.hashmig.createMigrationsTable()).then(function(){return n.logger.success("--- Migration table created"),!0})})}catch(e){return Promise.reject(e)}},this.createMigrationFolder=function(){try{return t.hashmig.isMigrationsFolderExists()||(t.hashmig.createMigrationsFolder(),t.logger.success("--- Migration folder created")),Promise.resolve(!0)}catch(e){return Promise.reject(e)}},this.initMigrations=function(e){void 0===e&&(e=!1);try{return Promise.resolve(i.hashmig.getMigrations()).then(function(n){if(e||!(n.length>0))return Promise.resolve(r({type:"toggle",name:"value",message:"Would you like to initialize migrations by existing stored procedures and functions it?",initial:!0,active:"yes",inactive:"no"})).then(function(e){if(e.value)return Promise.resolve(i.hashmig.getFunctions()).then(function(e){return Promise.resolve(r({type:"multiselect",name:"value",message:"Select functions",choices:e.map(function(e){return{title:e.Name,value:e.Name,selected:!0}})})).then(function(e){var n=e.value;return Promise.resolve(i.hashmig.getProcedures()).then(function(e){return Promise.resolve(r({type:"multiselect",name:"value",message:"Select procedures",choices:e.map(function(e){return{title:e.Name,value:e.Name,selected:!0}})})).then(function(e){var r=e.value;function t(){var e=function(){if(n.length>0)return Promise.resolve(i.hashmig.initFunctions(n)).then(function(){i.logger.success("--- Migration for functions initialized")})}();if(e&&e.then)return e.then(function(){})}var o=function(){if(r.length>0)return Promise.resolve(i.hashmig.initProcedures(r)).then(function(){i.logger.success("--- Migration for procedures initialized")})}();return o&&o.then?o.then(t):t()})})})});i.logger.error("--- Migrations don't initialized")})})}catch(e){return Promise.reject(e)}},this.runMigrations=function(){try{return Promise.resolve(o.hashmig.getMigrationsToRun()).then(function(e){var n;function t(t){return n?t:Promise.resolve(r({type:"multiselect",name:"value",message:"Select files to run",choices:Array.from(e.values()).map(function(e){return{title:e,value:e,selected:!0}})})).then(function(e){var r=e.value;if(0!==r.length)return Promise.resolve(o.hashmig.runMigrations(r)).then(function(){o.logger.success("--- Migrations completed")});o.logger.error("--- No one file selected")})}if(0!==e.size){var i=function(){if(!o.isInteractive)return Promise.resolve(o.hashmig.runMigrations(Array.from(e.values()))).then(function(){o.logger.success("--- Migrations completed"),n=1})}();return i&&i.then?i.then(t):t(i)}o.logger.success("--- All migrations already completed")})}catch(e){return Promise.reject(e)}},this.logger=new m,this.hashmig=new v}return e.prototype.init=function(e){var r=S.getConfig(e);r||(console.log("Config not found"),process.exit(1)),this.hashmig=new v(l({},r,{silent:!1}))},e}();!function(){try{return(new T).main()}catch(e){Promise.reject(e)}}();
//# sourceMappingURL=hashmig.mjs.map
