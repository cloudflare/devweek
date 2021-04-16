import * as utils from '../utils';

interface Animal {
	image: string;
	source: string;
}

function toKeyname(name: string, smol: boolean): string {
	let key = `animal::${name.toLowerCase()}`;
	if (smol) key += '::smol';
	return key;
}

// Load KV Namespace w/ values
export async function load(): Promise<void> {
	const Dataset: {
		[name: string]: {
			baby: Animal;
			adult: Animal;
		}
	} = {
		Puffin: {
			adult: {
				image: 'https://cdn.pixabay.com/photo/2019/04/22/08/55/puffin-4146015_1280.jpg',
				source: 'https://pixabay.com/photos/puffin-bird-nature-penguin-birds-4146015/'
			},
			baby: {
				image: 'https://i.pinimg.com/564x/fd/e4/95/fde495fccca8ec722be74cd4079f1842.jpg',
				source: 'https://www.pinterest.com/pin/123004633544859667/'
			},
		},
		Fox: {
			adult: {
				image: 'https://cdn.pixabay.com/photo/2015/04/10/01/41/fox-715588_1280.jpg',
				source: 'https://pixabay.com/photos/fox-nature-animals-roux-fauna-715588/'
			},
			baby: {
				image: 'https://cdn.pixabay.com/photo/2018/03/11/20/42/mammals-3218028_1280.jpg',
				source: 'https://pixabay.com/photos/mammals-fox-wildlife-natural-wild-3218028/'
			}
		},
		Dog: {
			adult: {
				image: 'https://cdn.pixabay.com/photo/2015/03/26/09/47/dog-690318_1280.jpg',
				source: 'https://pixabay.com/photos/dog-golden-retriever-canine-pet-690318/'
			},
			baby: {
				image: 'https://cdn.pixabay.com/photo/2016/02/09/12/25/puppy-1189067_1280.jpg',
				source: 'https://pixabay.com/photos/puppy-golden-retriever-dog-pet-1189067/'
			}
		},
		Cat: {
			adult: {
				image: 'https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.jpg',
				source: 'https://pixabay.com/photos/cat-kitten-pets-animals-housecat-2934720/'
			},
			baby: {
				image: 'https://cdn.pixabay.com/photo/2017/07/25/01/22/cat-2536662_1280.jpg',
				source: 'https://pixabay.com/photos/cat-flower-kitten-stone-pet-2536662/'
			}
		},
		Chimpanzee: {
			adult: {
				image: 'https://cdn.pixabay.com/photo/2018/09/25/21/32/chimpanzee-3703230_1280.jpg',
				source: 'https://pixabay.com/photos/chimpanzee-monkey-ape-mammal-zoo-3703230/'
			},
			baby: {
				image: 'https://cdn.pixabay.com/photo/2018/02/05/18/22/chimp-3132852_1280.jpg',
				source: 'https://pixabay.com/photos/chimp-baby-monkey-feelings-look-3132852/'
			}
		},
		Hedgehog: {
			adult: {
				image: 'https://cdn.pixabay.com/photo/2016/02/22/10/06/hedgehog-1215140_1280.jpg',
				source: 'https://pixabay.com/photos/hedgehog-cute-animal-little-nature-1215140/'
			},
			baby: {
				image: 'https://cdn.pixabay.com/photo/2020/05/09/08/27/hedgehog-5148711_1280.jpg',
				source: 'https://pixabay.com/photos/hedgehog-young-animal-animal-world-5148711/'
			}
		},
		Chicken: {
			adult: {
				image: 'https://cdn.pixabay.com/photo/2019/04/24/08/48/chicken-4151637_1280.jpg',
				source: 'https://pixabay.com/photos/chicken-freiland-chicken-animal-4151637/'
			},
			baby: {
				image: 'https://cdn.pixabay.com/photo/2014/05/20/21/20/bird-349026_1280.jpg',
				source: 'https://pixabay.com/photos/bird-chicks-baby-chicken-young-bird-349026/'
			}
		}
	};

	const names = Object.keys(Dataset).sort();

	await ANIMALS.put(
		'animal::choices',
		JSON.stringify(names)
	);

	for (const name of names) {
		let images = Dataset[name];

		await Promise.all([
			ANIMALS.put(
				toKeyname(name, true),
				JSON.stringify(images.baby)
			),
			ANIMALS.put(
				toKeyname(name, false),
				JSON.stringify(images.adult)
			)
		]);
	}
}

// The command definition
// @see https://discord.com/developers/docs/interactions/slash-commands#registering-a-command
export async function command() {
	// Retrieve all `Animal` names from KV
	const names = await ANIMALS.get<string[]>('animal::choices', 'json') || [];

	return {
		name: 'blep',
		description: 'Send a random adorable animal photo',
		options: [
			{
				name: 'animal',
				description: 'The type of animal',
				required: true,
				type: 3,
				choices: names.map(str => {
					return {
						name: str,
						value: str.toLowerCase()
					}
				})
			}, {
				name: 'only_smol',
				description: 'Whether to show only baby animals',
				required: false,
				type: 5,
			}
		]
	};
}

/**
 * Handle the slash command's input
 * @param {Option[]} options The command's selected options.
 */
export async function handler(options: Option[]): Promise<Response> {
	// Convert `options` to object
	let values: Record<string, unknown> = {};
	options.forEach(obj => values[obj.name] = obj.value);

	// Construct key name
	let key = toKeyname(
		values.animal as string,
		values.only_smol as boolean
	);

	const value = await ANIMALS.get<Animal>(key, 'json');
	if (!value) return utils.respond(404, 'Invalid choice(s)');

	let alttext = 'A ';
	if (values.only_smol) alttext += 'baby ';
	alttext += values.animal;

	// @see https://discord.com/developers/docs/interactions/slash-commands#InteractionApplicationCommandCallbackData
	return utils.respond(200, {
		type: 4,
		data: {
			embeds: [{
				type: 'image',
				description: alttext,
				provider: { url: value.source },
				image: { url: value.image },
			}],
		},
	});
}
