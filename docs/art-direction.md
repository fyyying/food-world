# Art direction for Food World pictures

This standard applies to every generated picture: concept images, room paintings, sprites and card illustrations. Follow it when you write an image brief and when you accept or reject a delivered image.

## 1. The reference set

Judge every new picture against these files. They are the canon.

| Reference | File | What it shows |
| --- | --- | --- |
| Light, density and food | `public/scenes/hotpot/wide.jpg` | A warm night interior, four readable people, a food table that fills the foreground, lanterns and chillies as hanging detail, a lit town behind |
| Clothing and street life | `public/scenes/tr_simit/wide.jpg` | Traditional everyday dress on a working quay, a vendor and customers in a clear exchange, stacked food in the foreground, gulls in real sky |
| Portrait composition | `public/scenes/tr_simit/portrait.jpg` | The same place recomposed vertically, not cropped |
| Sprites | `public/scenes/props/red-lantern.webp`, `chilli-hanging.webp` | One object, clean edge, no background |

The hotpot painting predates the clothing rule in section 3. Its people wear present-day clothes. Use it for light, density and food, and use the Turkey rooms for clothing.

## 2. Style: between realistic and cartoon

The style is painterly illustrated realism. It sits between a photograph and a cartoon.

Required:

- Visible brushwork and painted texture on walls, cloth, wood and stone
- Believable light with one light source logic: warm lanterns at night, a sun direction by day, coloured bounce on nearby surfaces
- Real proportions for bodies, hands, furniture and buildings. Faces may be softened and eyes slightly enlarged, as in the reference set
- Rich, saturated but natural colour. Reds, golds, warm browns and deep blues in China; warm limestone, textile red and İznik blue in Turkey. Each area has its own palette in its brief
- Depth in three planes: food in the foreground, people and work in the middle, the place behind
- Complete scenes. Every seat, table, shelf and hook holds what rests on it

Rejected:

- Photorealism, photo compositing, or a rendered 3D look with plastic highlights
- Flat vector shapes, thick outlines, cel shading, chibi proportions or mascot faces
- Blurred or smeared regions, invented text, watermarks, borders, checkerboards, captions
- Contact sheets, collages, split panels, before-and-after frames
- Interface elements painted into the art: no arrows, rings, diamonds or labels

## 3. People

- Dress people in the area's historical and traditional everyday clothing. Working clothes, not festival costume. Aprons, waistcoats, sashes, headscarves, caps, shawls and loose trousers as the area used them
- Vary age, height, build, skin, hair, face, occupation and gesture. Children take small steps; elders lean a little
- Show four to eight readable people in a room, with smaller background figures only where they help
- People cook, carry, choose, serve, pour, share and talk. Nobody poses for the viewer
- Do not mix one imagined ancient era with modern clothes in one picture. Record the period the brief chose

## 4. Food

Food is the most realistic element in every picture.

- Accurate ingredients and preparation for the named dish. A Valencian paella shows chicken, rabbit, flat beans and garrofó, not a seafood mix
- Readable texture at phone scale: the char on bread, the sheen on syrup, the marbling in ham, the grain of rice
- Real scale against hands, plates and tables
- The main food occupies a substantial part of the foreground in both orientations
- Every hot food may show steam. Every liquid stream leaves the low edge of a tilted vessel and falls with gravity. Check vessel orientation before acceptance

## 5. Places and architecture

- One clear regional setting per picture. Do not stack every landmark into one view
- Materials, roof forms, colours and street furniture from the brief's architecture research
- Landmarks stay behind the food, smaller than the table
- Leave one open area of sky or water where a bird or a mist bank can move without crossing a person

## 6. Room pairs

Each room ships as two independently composed paintings.

| Item | Wide | Portrait |
| --- | --- | --- |
| Size | 1672 x 941 pixels | 941 x 1672 pixels |
| Use | Desktop and tablets | Phones |
| Composition | Reveals the work surface and the place | Stacks food, cook and place vertically |
| Discovery subjects | The same three subjects visible and unobstructed | The same three, repositioned, still unobstructed |
| Motion area | A crisp local area for the signature action | The same action, recomposed |

Do not crop, stretch or upscale one to make the other. Report the delivered dimensions in the inventory.

## 7. Sprites and card illustrations

- One object or one tight group per file, large on the canvas, fully visible, on pure white. A glowing lantern may come on black
- Clean edges, no cast shadow beyond the object, no ground plane
- Short side at least 400 pixels after trimming. The cutter limits the long side to 960 pixels
- Sprites exist only for motion or layering: a hanging lantern, a chilli string, a leaf, a gull, an awning fringe
- Card illustrations show one food close enough to read its texture: three folded slices of ham, one complete gilda, one wedge of cheese
- Do not generate steam, ripples, flour clouds, liquid streams, glows or markers as sprites. The code draws them

## 8. Acceptance check

Accept a picture only when every line is true.

- Style matches the reference set: painted, not photographic, not cartoon
- People wear the area's traditional everyday clothing and vary in every way listed above
- Food is accurate, realistic and large enough to read on a phone
- The scene is complete and physically possible: supports, hands, utensils, vessel orientation
- The three discovery subjects are visible and unobstructed in both orientations
- The signature motion has a clean local area or a separate sprite
- No text, borders, markers, collage or blur
- The file has the required size and a name from the brief

Reject and regenerate. Do not repair a wrong picture with an overlay.
