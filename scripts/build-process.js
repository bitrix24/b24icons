import { exec } from 'node:child_process'
import { typeList } from './type-list.js'

class Command
{
	constructor(action = '')
	{
		this.action = action;
	}
	
	getAction()
	{
		return this.action;
	}
}

class Log
{
	constructor(action = '')
	{
		this.action = action;
	}
	
	getAction()
	{
		return this.action;
	}
}

class Builder
{
	#commands;
	
	constructor()
	{
		this.#commands = new Set();
	}
	
	/**
	 * Add new command to show Log
	 *
	 * @param action
	 * @returns {Builder}
	 */
	addLog(action = '')
	{
		this.#commands.add(new Log(action));
		return this;
	}
	
	/**
	 * Add new command to stack
	 *
	 * @param action
	 * @returns {Builder}
	 */
	addCommand(action = '')
	{
		this.#commands.add(new Command(action));
		return this;
	}
	
	/**
	 * Prepare command cat and add to stack
	 * @param action
	 * @return {Builder}
	 */
	addCommandCatFiles(action = '')
	{
		action = process.platform === 'win32'
			? `powershell -command "$PSDefaultParameterValues[\'Out-File:Encoding\'] = \'utf8\'; ${action}"`
			: `${action}`;
		
		return this.addCommand(action);
	}
	
	/**
	 * Clear command from stack
	 *
	 * @returns {Builder}
	 */
	clearCommands()
	{
		this.#commands.clear();
		return this;
	}
	
	/**
	 * @param command
	 * @returns {Promise<void>}
	 */
	async #makeExec(command = '')
	{
		return new Promise((resolve, reject) => {
			let options = {};
			if(process.platform === 'win32')
			{
				options.shell = 'powershell.exe';
			}
			exec(command, options, (error, stdout, stderr) => {
				if(error)
				{
					reject(error);
				}
				else
				{
					resolve({
						stdout,
						stderr
					});
				}
			})
		});
	}
	
	/**
	 * Make exec 1 by 1 all commands from stack
	 *
	 * @returns {Promise<void>}
	 */
	async run()
	{
		try
		{
			/**
			 * @memo set for windows utf-8 output
			 */
			/*/
			if(process.platform === 'win32')
			{
				await this.#makeExec('chcp 65001>nul');
			}
			//*/
			
			for (let action of this.#commands)
			{
				if(action instanceof Log)
				{
					console.debug(action.getAction());
				}
				else if(action instanceof Command)
				{
					await this.#makeExec(action.getAction());
				}
				else
				{
					await this.#makeExec(action);
				}
				
			}
		}
		catch(error)
		{
			console.error('Error executing:', error);
		}
	}
}

const builder = (new Builder())
builder.clearCommands()
builder.addLog(`Processing SVG icons ...`)

typeList.map((type) => {
	builder.addLog(`[ ${type} ]`);
	
	builder.addCommand(`rimraf --glob ./export/${type} ./optimized/${type}`);
	builder.addLog(`✓ clear`);
	
	if(type.includes('specialized'))
	{
		if(process.platform === 'win32')
		{
			builder.addCommand(`mkdir optimized/${type}`);
			builder.addCommand(`Copy-Item ./src/icons/${type} ./optimized -Recurse -Force`);
		}
		else
		{
			builder.addCommand(`mkdir -p ./optimized`);
			builder.addCommand(`mkdir -p ./optimized/${type}`);
			builder.addCommand(`cp -R ./src/icons/${type} ./optimized/`);
		}
		
		builder.addLog(`ⓘ skip svgo && copy as is`);
	}
	else
	{
		builder.addCommand(`svgo --config=svgo.solid.js -f ./src/icons/${type} -o ./optimized/${type} --pretty --indent=2`);
		builder.addLog(`✓ svgo`);
	}
	
	if(process.platform === 'win32')
	{
		builder.addCommand(`mkdir export/${type}`);
		builder.addCommand(`Copy-Item ./optimized/${type} ./export/ -Recurse -Force`);
	}
	else
	{
		builder.addCommand(`mkdir -p ./export/${type}`);
		builder.addCommand(`cp -R ./optimized/${type} ./export/`);
	}
	builder.addLog(`✓ copy`);
	builder.addLog(``);
})

builder.addLog(`Finished processing SVG icons.`)

builder.run()
.catch((error) => {
	console.error(error);
})