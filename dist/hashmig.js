#!/usr/bin/env node
var e=require("dotenv"),t=require("prompts"),r=require("commander"),n=require("fs"),i=require("mysql2"),o=require("kleur"),s=require("crypto"),a=require("zod"),u=require("@rsol/pipe");function c(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function l(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach(function(r){if("default"!==r){var n=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,n.get?n:{enumerable:!0,get:function(){return e[r]}})}}),t.default=e,t}var f=/*#__PURE__*/c(e),h=/*#__PURE__*/c(t),g=/*#__PURE__*/l(n),d=/*#__PURE__*/c(n),m=/*#__PURE__*/c(i),v=/*#__PURE__*/c(o),p=/*#__PURE__*/c(s),b=/*#__PURE__*/c(u);function y(){return y=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},y.apply(this,arguments)}function P(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function E(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(r)return(r=r.call(e)).next.bind(r);if(Array.isArray(e)||(r=function(e,t){if(e){if("string"==typeof e)return P(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?P(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0;return function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}f.default.config();var S=/*#__PURE__*/function(){function e(e){this.conn=void 0,this.connect(e)}var t=e.prototype;return t.connect=function(e){this.conn=m.default.createConnection(e)},t.query=function(e,t){try{var r=this;return Promise.resolve(new Promise(function(n,i){var o;r.conn||i("Connection is not established"),null==(o=r.conn)||o.query(e,t,function(e,t){e?i(e):n(t)})}))}catch(e){return Promise.reject(e)}},t.execute=function(e,t){try{var r=this;return Promise.resolve(new Promise(function(n,i){var o;r.conn||i("Connection is not established"),null==(o=r.conn)||o.execute(e,t,function(e,t){e?i(e):n(t)})}))}catch(e){return Promise.reject(e)}},e}(),M=/*#__PURE__*/function(){function e(e){void 0===e&&(e=!1),this.silent=!1,this.silent=e}var t=e.prototype;return t.log=function(e){!this.silent&&console.log(v.default.gray().italic(e))},t.info=function(e){!this.silent&&console.log(v.default.green().italic(e))},t.warn=function(e){!this.silent&&console.warn(v.default.red().italic(e))},t.error=function(e){!this.silent&&console.error(v.default.red().italic(e))},t.success=function(e){!this.silent&&console.log(v.default.bgGreen().bold(e))},e}();function T(e,t){try{var r=e()}catch(e){return t(e)}return r&&r.then?r.then(void 0,t):r}var N=/*#__PURE__*/function(){function e(e){var t;this.db=void 0,this.folder=void 0,this.database=void 0,this.table=void 0,this.logger={log:function(){},info:function(){},warn:function(){},error:function(){},success:function(){}},this.folder=(null==e?void 0:e.folder)||"./hashmig_migrations",this.table=(null==e?void 0:e.table)||"hashmig_migrations",this.database=(null==e||null==(t=e.db)?void 0:t.database)||process.env.DB_SELECT,this.initLogger(null==e?void 0:e.logger,null==e?void 0:e.silent),this.db=new S((null==e?void 0:e.db)||{port:+(process.env.DB_PORT||3306),host:process.env.DB_SERVER,database:process.env.DB_SELECT,user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,ssl:{rejectUnauthorized:!1}})}var t=e.prototype;return t.initLogger=function(e,t){t||(this.logger=this.instanceOfLoggerEngine(e||{})?e:new M)},t.instanceOfLoggerEngine=function(e){return["log","info","warn","error","success"].reduce(function(t,r){return t&&r in e},!0)},t.isMigrationsFolderExists=function(){return g.existsSync(this.folder)},t.createMigrationsFolder=function(){g.mkdirSync(this.folder)},t.getProcedures=function(){try{return Promise.resolve(this.db.query("SHOW PROCEDURE STATUS WHERE Db = '"+this.database+"'").then(function(e){return e}).then(function(e){return e.map(function(e){return{Name:e.Name,Modified:e.Modified}})}))}catch(e){return Promise.reject(e)}},t.getFunctions=function(){try{return Promise.resolve(this.db.query("SHOW FUNCTION STATUS WHERE Db = '"+this.database+"'").then(function(e){return e}).then(function(e){return e.map(function(e){return{Name:e.Name,Modified:e.Modified}})}))}catch(e){return Promise.reject(e)}},t.getProcedureSource=function(e){try{return Promise.resolve(this.db.query("SHOW CREATE PROCEDURE "+e).then(function(e){return e}).then(function(e){return e[0]["Create Procedure"]}))}catch(e){return Promise.reject(e)}},t.getFunctionSource=function(e){try{return Promise.resolve(this.db.query("SHOW CREATE FUNCTION "+e).then(function(e){return e}).then(function(e){return e[0]["Create Function"]}))}catch(e){return Promise.reject(e)}},t.isMigrationsTableExists=function(){try{return Promise.resolve(this.db.query("SHOW TABLES LIKE '"+this.table+"'").then(function(e){return e}).then(function(e){return e.length>0}))}catch(e){return Promise.reject(e)}},t.createMigrationsTable=function(){try{return Promise.resolve(this.db.query("\n        CREATE TABLE "+this.table+"\n        (\n            ID        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n            FileName  VARCHAR(255)                   NOT NULL,\n            Hash      VARCHAR(312)                   NOT NULL,\n            Type      ENUM ('procedure', 'function') NOT NULL,\n            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n        )\n    "))}catch(e){return Promise.reject(e)}},t.getMigrations=function(){try{var e=this;return Promise.resolve(e.db.query("\n      SELECT FileName, Hash, Type\n       FROM "+e.table+"\n       WHERE ID IN (\n          SELECT MAX(ID) FROM "+e.table+" GROUP BY FileName\n       )\n    "))}catch(e){return Promise.reject(e)}},t.initProcedures=function(e){try{var t=function(){n.length>0&&r.logger.error("     - migrations for procedures "+n.join(", ")+" not initialized")},r=this,n=[],i=0,o=O(e,function(e){i++;var t=T(function(){return Promise.resolve(r.initProcedure(e)).then(function(){r.logger.info("     "+i+". migration for procedure "+e+" initialized")})},function(t){n.push(e),r.logger.error("     "+i+". migration for procedure "+e+" not initialized: "+t.message)});if(t&&t.then)return t.then(function(){})});return Promise.resolve(o&&o.then?o.then(t):t())}catch(e){return Promise.reject(e)}},t.initProcedure=function(e){try{var t=this;return Promise.resolve(t.getProcedureSource(e)).then(function(r){r=r.replace(/DEFINER=`[^`]+`@`[^`]+`/,"");var n=t.getHash(r="DROP PROCEDURE IF EXISTS `"+e+"`;\n-- NEW_COMMAND\n"+r),i="p_"+e+".sql";return g.writeFileSync(t.folder+"/"+i,r),Promise.resolve(t.db.query("INSERT INTO "+t.table+" (FileName, Hash, Type)\n                         VALUES (?, ?, 'procedure')",[i,n])).then(function(){})})}catch(e){return Promise.reject(e)}},t.initFunctions=function(e){try{var t=function(){n.length>0&&r.logger.error("     - migrations for functions "+n.join(", ")+" not initialized")},r=this,n=[],i=0,o=O(e,function(e){i++;var t=T(function(){return Promise.resolve(r.initFunction(e)).then(function(){r.logger.info("     "+i+". migration for function "+e+" initialized")})},function(t){n.push(e),r.logger.error("     "+i+". migration for function "+e+" not initialized: "+t.message)});if(t&&t.then)return t.then(function(){})});return Promise.resolve(o&&o.then?o.then(t):t())}catch(e){return Promise.reject(e)}},t.initFunction=function(e){try{var t=this;return Promise.resolve(t.getFunctionSource(e)).then(function(r){r=r.replace(/DEFINER=`[^`]+`@`[^`]+`/,"");var n=t.getHash(r="DROP PROCEDURE IF EXISTS `"+e+"`;\n-- NEW_COMMAND\n"+r),i="f_"+e+".sql";return g.writeFileSync(t.folder+"/"+i,r),Promise.resolve(t.db.query("INSERT INTO "+t.table+" (FileName, Hash, Type)\n                         VALUES (?, ?, 'function')",[i,n])).then(function(){})})}catch(e){return Promise.reject(e)}},t.getHash=function(e){return function(e,t){void 0===t&&(t="_@#$^*_");var r=[],n=-1,i=e.replace(/[\n\r]/g," ").replace(/\t/g," ").replace(/\\'/g,t+"single"+t).replace(/\\"/g,t+"double"+t).replace(/'.*?'/g,function(e){return r.push(e),n++,""+t+n+t}).replace(/".*?"/g,function(e){return r.push(e),n++,""+t+n+t}).replace(/\s{2,}/g," ");return r.forEach(function(e,r){i=i.replace(""+t+r+t,e)}),p.default.createHash("sha256").update(i).digest("hex")}(e)},t.getMigrationsFiles=function(){try{for(var e,t=this,r=new Map,n=E(g.readdirSync(t.folder));!(e=n()).done;){var i=e.value,o=g.readFileSync(t.folder+"/"+i).toString(),s=t.getHash(o);r.set(s,i)}return Promise.resolve(r)}catch(e){return Promise.reject(e)}},t.getMigrationsToRun=function(e){void 0===e&&(e=!1);try{var t=this;return Promise.resolve(t.getMigrations().then(function(e){return e.reduce(function(e,t){var r=e[0],n=e[1];return r.set(t.Hash,t.FileName),n.set(t.FileName,t.Hash),[r,n]},[new Map,new Map])})).then(function(r){var n=r[0],i=r[1];return Promise.resolve(t.getMigrationsFiles()).then(function(r){for(var o,s=E(r);!(o=s()).done;){var a=o.value,u=a[0],c=a[1];if(n.has(u)&&n.get(u)===c)r.delete(u);else{var l="     + "+c+" will be migrated"+(e?" (file hash "+u+" != db hash "+(i.has(c)?i.get(c):"-")+")":"");t.logger.log(l)}}return r})})}catch(e){return Promise.reject(e)}},t.runMigrations=function(e){try{var t=function(){n.length>0&&r.logger.error("     - migrations for files "+n.join(", ")+" not completed")},r=this,n=[],i=0,o=O(e,function(e){i++;var t=T(function(){return Promise.resolve(r.migrateFile(e)).then(function(){r.logger.info("     "+i+". migration for file "+e+" completed")})},function(t){n.push(e),r.logger.error("     "+i+". migration for file "+e+" not completed: "+t.message)});if(t&&t.then)return t.then(function(){})});return Promise.resolve(o&&o.then?o.then(t):t())}catch(e){return Promise.reject(e)}},t.migrateFile=function(e){try{var t=this,r=g.readFileSync(t.folder+"/"+e).toString(),n=t.getHash(r);return Promise.resolve(t.runFileSql(r)).then(function(){return Promise.resolve(t.db.query("INSERT INTO "+t.table+" (FileName, Hash, Type)\n                         VALUES (?, ?, 'function')",[e,n])).then(function(){})})}catch(e){return Promise.reject(e)}},t.clear=function(){try{var e=this;return Promise.resolve(e.clearDb()).then(function(){e.clearFolder()})}catch(e){return Promise.reject(e)}},t.clearDb=function(){try{var e=this;return Promise.resolve(e.db.query("DROP TABLE IF EXISTS "+e.table)).then(function(){e.logger.success("--- Migrations table dropped")})}catch(e){return Promise.reject(e)}},t.clearFolder=function(){g.rmSync(this.folder,{recursive:!0,force:!0}),this.logger.success("--- Migrations folder removed")},t.runFileSql=function(e){try{var t=this,r=e.toString().split("NEW_COMMAND");return Promise.all(r.map(function(e){return e.trim()}).filter(Boolean).map(function(e){return t.db.query(e)}))}catch(e){return Promise.reject(e)}},e}();const j="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function F(e,t,r){if(!e.s){if(r instanceof A){if(!r.s)return void(r.o=F.bind(null,e,t));1&t&&(t=r.s),r=r.v}if(r&&r.then)return void r.then(F.bind(null,e,t),F.bind(null,e,2));e.s=t,e.v=r;var n=e.o;n&&n(e)}}var A=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,r){var n=new e,i=this.s;if(i){var o=1&i?t:r;if(o){try{F(n,1,o(this.v))}catch(e){F(n,2,e)}return n}return this}return this.o=function(e){try{var i=e.v;1&e.s?F(n,1,t?t(i):i):r?F(n,1,r(i)):F(n,2,i)}catch(e){F(n,2,e)}},n},e}();function R(e){return e instanceof A&&1&e.s}function O(e,t,r){if("function"==typeof e[j]){var n,i,o,s=e[j]();if(function e(a){try{for(;!((n=s.next()).done||r&&r());)if((a=t(n.value))&&a.then){if(!R(a))return void a.then(e,o||(o=F.bind(null,i=new A,2)));a=a.v}i?F(i,1,a):i=a}catch(e){F(i||(i=new A),2,e)}}(),s.return){var a=function(e){try{n.done||s.return()}catch(e){}return e};if(i&&i.then)return i.then(a,function(e){throw a(e)});a()}return i}if(!("length"in e))throw new TypeError("Object is not iterable");for(var u=[],c=0;c<e.length;c++)u.push(e[c]);return function(e,t,r){var n,i,o=-1;return function s(a){try{for(;++o<e.length&&(!r||!r());)if((a=t(o))&&a.then){if(!R(a))return void a.then(s,i||(i=F.bind(null,n=new A,2)));a=a.v}n?F(n,1,a):n=a}catch(e){F(n||(n=new A),2,e)}}(),n}(u,function(e){return t(u[e])},r)}var D=/*#__PURE__*/function(){function e(){}return e.getConfig=function(e){return void 0===e&&(e="./hashmig.config.json"),this.fileName=e,this.loadConfigFromFile()||this.getConfigFromEnv()||null},e.getConfigFromEnv=function(){var e={db:{port:+(process.env.DB_PORT||3306),host:process.env.DB_SERVER,database:process.env.DB_SELECT,user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,ssl:{rejectUnauthorized:!1}},folder:process.env.HASHMIG_FOLDER||"./hashmig_migrations",table:process.env.HASHMIG_TABLE||"hashmig_migrations",silent:"true"===process.env.HASHMIG_SILENT};return this.validateAndFillConfig(e)},e.loadConfigFromFile=function(){if(!d.default.existsSync(""+this.fileName))return null;var e=d.default.readFileSync(""+this.fileName).toString();return this.validateAndFillConfig(JSON.parse(e))},e.validateAndFillConfig=function(e){var t=a.z.object({db:a.z.object({port:a.z.string().or(a.z.number()),host:a.z.string(),database:a.z.string(),user:a.z.string(),password:a.z.string(),ssl:a.z.object({rejectUnauthorized:a.z.boolean().or(a.z.string())})}),folder:a.z.string(),table:a.z.string(),silent:a.z.string().or(a.z.boolean())});try{var r,n,i,o,s;t.parse(e);var u=a.z.object({db:a.z.object({port:a.z.number(),host:a.z.string(),database:a.z.string(),user:a.z.string(),password:a.z.string(),ssl:a.z.object({rejectUnauthorized:a.z.boolean()})}),folder:a.z.string(),table:a.z.string(),silent:a.z.boolean()}),c=(new b.default).addHandler("env",function(){return function(e,t){return process.env[e]||t}}),l={db:{port:c.pipe(((null==(r=e.db)?void 0:r.port)||3306)+"|toInt"),host:c.pipe((null==(n=e.db)?void 0:n.host)||""),database:c.pipe((null==(i=e.db)?void 0:i.database)||""),user:c.pipe((null==(o=e.db)?void 0:o.user)||""),password:c.pipe((null==(s=e.db)?void 0:s.password)||""),ssl:e.db.ssl},folder:c.pipe(e.folder||""),table:c.pipe(e.table||""),silent:!0===e.silent||!1!==e.silent&&c.pipe(e.silent||"false|toBool")};return u.parse(l)}catch(e){return console.error(e),null}},e}();D.fileName="./hashmig.config.json";var I=new r.Command,w=/*#__PURE__*/function(){function e(){var e=this,t=this,r=this,n=this,i=this;this.hashmig=void 0,this.logger=void 0,this.isInteractive=!0,this.debug=!1,this.main=function(){try{return I.name("hashmig").description("CLI migrations tool for MySQL stored procedures and functions").version("1.0.4").option("-c, --config <string>","Path to config file","./hashmig.config.json").hook("preAction",function(t){var r=t.opts();e.init(r.config)}),I.addHelpText("after","\n\nTo configure, you can use `./hashmig.config.json` (see `./hashmig.example.config.json`) file or the following environment variables:\n  DB_PORT - post number\n  DB_SERVER - server address\n  DB_SELECT - database name\n  DB_USERNAME - username\n  DB_PASSWORD - password\n  HASHMIG_FOLDER - path to folder with migrations\n  HASHMIG_TABLE - name of table with migrations\n  HASHMIG_SILENT - disable logger"),I.command("run").description("Execute migrations").option("-n, --noninteractive","Non-interactive mode",!1).option("-d, --debug","Debug mode",!1).action(function(t){var r=t.noninteractive,n=t.debug,i=void 0!==n&&n;e.isInteractive=!(void 0!==r&&r),e.debug=i;try{return Promise.resolve(e.createMigrationsTableExists()).then(function(t){return t||process.exit(0),Promise.resolve(e.createMigrationFolder()).then(function(r){function n(t){return Promise.resolve(e.runMigrations()).then(function(){process.exit(0)})}return(t=r)||process.exit(0),e.isInteractive?Promise.resolve(e.initMigrations()).then(n):n()})})}catch(e){Promise.reject(e)}}),I.command("clear").description("Clear folder and table").action(function(){try{return Promise.resolve(h.default({type:"toggle",name:"value",message:"Are you sure to delete table and folder?",initial:!0,active:"yes",inactive:"no"})).then(function(t){return t.value||process.exit(0),Promise.resolve(e.hashmig.clear()).then(function(){})})}catch(e){Promise.reject(e)}}),I.command("init").description("Fill table and folder by existing stored procedures and functions").action(function(){try{return Promise.resolve(e.createMigrationsTableExists()).then(function(t){return t||process.exit(0),Promise.resolve(e.createMigrationFolder()).then(function(r){return(t=r)||process.exit(0),Promise.resolve(e.initMigrations(!0)).then(function(){})})})}catch(e){Promise.reject(e)}}),I.parse(),Promise.resolve()}catch(e){return Promise.reject(e)}},this.createMigrationsTableExists=function(){try{return Promise.resolve(t.hashmig.isMigrationsTableExists()).then(function(e){return!!e||Promise.resolve(t.hashmig.createMigrationsTable()).then(function(){return t.logger.success("--- Migration table created"),!0})})}catch(e){return Promise.reject(e)}},this.createMigrationFolder=function(){try{return r.hashmig.isMigrationsFolderExists()||(r.hashmig.createMigrationsFolder(),r.logger.success("--- Migration folder created")),Promise.resolve(!0)}catch(e){return Promise.reject(e)}},this.initMigrations=function(e){void 0===e&&(e=!1);try{return Promise.resolve(n.hashmig.getMigrations()).then(function(t){if(e||!(t.length>0))return Promise.resolve(h.default({type:"toggle",name:"value",message:"Would you like to initialize migrations by existing stored procedures and functions it?",initial:!0,active:"yes",inactive:"no"})).then(function(e){if(e.value)return Promise.resolve(n.hashmig.getFunctions()).then(function(e){return Promise.resolve(h.default({type:"multiselect",name:"value",message:"Select functions",choices:e.map(function(e){return{title:e.Name,value:e.Name,selected:!0}})})).then(function(e){var t=e.value;return Promise.resolve(n.hashmig.getProcedures()).then(function(e){return Promise.resolve(h.default({type:"multiselect",name:"value",message:"Select procedures",choices:e.map(function(e){return{title:e.Name,value:e.Name,selected:!0}})})).then(function(e){var r=e.value;function i(){var e=function(){if(t.length>0)return Promise.resolve(n.hashmig.initFunctions(t)).then(function(){n.logger.success("--- Migration for functions initialized")})}();if(e&&e.then)return e.then(function(){})}var o=function(){if(r.length>0)return Promise.resolve(n.hashmig.initProcedures(r)).then(function(){n.logger.success("--- Migration for procedures initialized")})}();return o&&o.then?o.then(i):i()})})})});n.logger.error("--- Migrations don't initialized")})})}catch(e){return Promise.reject(e)}},this.runMigrations=function(){try{return Promise.resolve(i.hashmig.getMigrationsToRun(i.debug)).then(function(e){var t;function r(r){return t?r:Promise.resolve(h.default({type:"multiselect",name:"value",message:"Select files to run",choices:Array.from(e.values()).map(function(e){return{title:e,value:e,selected:!0}})})).then(function(e){var t=e.value;if(0!==t.length)return Promise.resolve(i.hashmig.runMigrations(t)).then(function(){i.logger.success("--- Migrations completed")});i.logger.error("--- No one file selected")})}if(0!==e.size){var n=function(){if(!i.isInteractive)return Promise.resolve(i.hashmig.runMigrations(Array.from(e.values()))).then(function(){i.logger.success("--- Migrations completed"),t=1})}();return n&&n.then?n.then(r):r(n)}i.logger.success("--- All migrations already completed")})}catch(e){return Promise.reject(e)}},this.logger=new M,this.hashmig=new N}return e.prototype.init=function(e){var t=D.getConfig(e);t||(console.log("Config not found"),process.exit(1)),this.hashmig=new N(y({},t,{silent:!1}))},e}();!function(){try{return(new w).main()}catch(e){Promise.reject(e)}}();
//# sourceMappingURL=hashmig.js.map
