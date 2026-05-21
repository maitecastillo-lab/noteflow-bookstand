## React Native vs una app nativa

Una app nativa se hace con el lenguaje propio de cada sistema: Kotlin o Java para Android, Swift para iOS. Eso significa que si quieres tu app en los dos sistemas, tienes que hacerla dos veces, cada una en su lenguaje.

Con React Native escribes en JavaScript (o TypeScript en mi caso) y la misma base de código vale para Android y para iOS. Lo que me llamó la atención es que aunque escribes en JavaScript, los componentes que ves en pantalla son nativos de verdad. Cuando pones un `<View>` no se está creando una página web disfrazada, React Native habla con el sistema y crea un componente nativo real. Por eso la app se siente igual de rápida que una nativa.

La pega es que hay dos "carriles" funcionando: uno donde corre el JavaScript y otro donde se dibuja la interfaz. Si en el de JavaScript meto algo muy pesado, la pantalla se queda colgada hasta que termine.

## Qué es el Metro bundler

Metro es el que junta todos los archivos `.ts` y `.tsx` del proyecto y los convierte en algo que el móvil pueda entender. Es parecido a lo que hace Webpack en proyectos web, pero pensado para móvil.

Lo que hace es:
- Coge todo el código y lo empaqueta.
- Se queda atento a los cambios que hago en los archivos.
- Cuando guardo, recarga la app automáticamente sin que tenga que reinstalarla.

Es lo que se arranca cuando hago `npx expo start`. Sin Metro no podría ver mis cambios en tiempo real.

## Por qué Expo Go no es suficiente en proyectos reales

Expo Go es la app que te descargas en el móvil, escaneas un QR y ya puedes probar tu proyecto. Es súper cómodo para empezar y para aprender, que es para lo que la voy a usar en Bookstand.

El problema es que solo trae las librerías "estándar" que vienen con Expo. Si un proyecto necesita algo más complejo (notificaciones push, biometría, una librería de pagos, etc.), Expo Go ya no sirve porque no incluye esos módulos.

Para esos casos se usa un Development Build, que es básicamente una app a medida, compilada solo para tu proyecto con las librerías que tú necesitas. La generan con una herramienta llamada EAS Build. Tarda más en prepararse y es más rollo, pero es lo que se usa en proyectos profesionales.

En mi caso, para Bookstand voy bien con Expo Go porque solo uso librerías compatibles (Zustand, AsyncStorage, FlashList, Gluestack UI, Expo Router).

## Sistemas de diseño: por qué elijo Gluestack UI

Para Bookstand tenía que elegir entre dos librerías UI populares en Expo: Gluestack UI y React Native Paper.

React Native Paper es la implementación oficial de Material Design, el sistema de Google. Sus ventajas son que tiene componentes listos para usar nada más instalarlo, se ve profesional desde el primer minuto y está muy bien integrado con Android. La pega es que todas las apps que usan Paper acaban pareciéndose entre sí, y personalizar a fondo es más complicado. Es la opción más cómoda cuando lo importante es ir rápido y no tanto la identidad visual.

Gluestack UI funciona de otra forma. Sus componentes son "headless" y altamente personalizables: te dan la lógica y el comportamiento, pero el estilo lo defines tú usando un sistema parecido a Tailwind (NativeWind). Tienes más libertad para construir una identidad visual única, aunque la curva de aprendizaje es algo mayor.

Para Bookstand elijo Gluestack por dos razones. La primera es estética: la app es una estantería digital, y quiero que se sienta acogedora y personal (colores cálidos, tipografía cuidada, vibe de librería casera). Material Design es demasiado corporativo para eso. La segunda es práctica: como voy a tener pocas pantallas pero quiero que se vean cuidadas, me compensa invertir tiempo en personalizar bien los componentes en lugar de aceptar el aspecto por defecto de Paper.

## Tipos de navegación: Tabs, Stack y Modal

Expo Router te deja moverte entre pantallas de tres formas distintas. En Bookstand uso las tres porque cada una sirve para algo diferente.

### Pestañas (Tabs)

Las tabs son los iconos de la barra de abajo que tienen casi todas las apps. Pinchas y saltas entre las secciones principales. Cada una es independiente: si vuelves, sigue como la dejaste.

Las uso para las tres secciones grandes de Bookstand: Libros, Listas y Ajustes. Son las que el usuario va a abrir todo el rato, así que tiene sentido tenerlas siempre a mano.

### Pila (Stack)

El stack es la navegación de toda la vida: entras en una pantalla, esa pantalla se "apila" encima, y arriba a la izquierda te sale una flechita para volver atrás.

Lo uso cuando el usuario quiere ver el detalle de un libro o de una lista. Pincha en uno desde la estantería, se abre la pantalla del detalle por encima, y al darle a la flecha vuelve a la estantería igual que estaba.

### Modal

Un modal es una pantalla que aparece "subiendo" desde abajo y tapa lo que había. No es que vayas a otro sitio, es más bien que estás haciendo algo puntual antes de seguir.

Lo uso para añadir un libro nuevo. Estás en tu estantería, pinchas el botón de añadir, sube el formulario, lo rellenas y al cerrar vuelves a la estantería donde estabas. Para esto no tendría sentido un stack porque no quieres "irte" a otra parte de la app, solo añadir una cosa rápido.

### Resumen

Tabs para las zonas principales. Stack para entrar en detalle y volver. Modal para acciones rápidas tipo formularios.

## Modelado de datos con TypeScript

NoteFlow tiene tres tipos de contenido: notas, tareas e ideas. Los modelé con TypeScript para tener todo tipado y que el editor me avise si me equivoco.

Las tres comparten campos básicos (id, título, fechas de creación y actualización), así que los metí en una interfaz común llamada BaseNote. Luego cada tipo hereda de ahí y añade lo suyo: Note tiene content (el texto), ChecklistNote tiene items (las tareas), e IdeaNote tiene tags y color. Así no repito los campos comunes tres veces.

También definí un tipo de unión llamado AnyNote, que puede ser cualquiera de los tres. Sirve para funciones que aceptan los tres tipos sin tener que duplicar código.

El lío con AnyNote es que TypeScript no sabe cuál de los tres es en concreto, así que no te deja acceder a campos específicos sin más. Para eso están los "type guards", que son básicamente comprobaciones que sirven de pista a TypeScript. Por ejemplo, "items" in note devuelve true solo si esa nota tiene items, que solo pasa en las checklists. Yo además le puse a cada interfaz una propiedad type ("note", "checklist", "idea"), así puedo distinguirlas mirando esa propiedad directamente, que queda más limpio.

## Gestión de estado: useState, Context API y Zustand

En React hay varias formas de manejar el estado, no todas valen lo mismo.

useState es lo más básico. Sirve para guardar cosas dentro de un componente. Funciona bien cuando solo necesitas esos datos ahí mismo. El problema viene cuando el dato lo necesita un componente que está lejos en el árbol y te toca ir pasándolo por todos los intermedios. A eso se le llama "prop drilling" y es bastante coñazo.

Context API soluciona ese problema: defines un contexto, lo envuelves alrededor de tus componentes y los de dentro pueden leerlo directamente. El lío es que cuando algo cambia en el contexto, se vuelven a renderizar TODOS los componentes que lo usan, aunque no usen la parte que cambió. En apps medianas tirando a grandes eso da problemas de rendimiento. Además, si necesitas varios contextos, te toca anidar providers y queda feo.

Zustand es lo que uso en NoteFlow. Es una librería bastante pequeña y simple. Creas un "store" con tus datos y tus funciones, y desde cualquier componente puedes leer solo lo que te interese. No hace falta envolver nada en un provider, y solo se re-renderiza el componente que usa la parte concreta que cambió. Para una app con varias pantallas que comparten datos (notas, tareas e ideas), va muy bien.

## Persistencia con AsyncStorage y rehidratación

AsyncStorage es el sistema básico para guardar datos en el dispositivo en React Native. Funciona tipo clave-valor: tú guardas algo con un nombre, y la próxima vez que abres la app lo recuperas con ese mismo nombre.

Tiene sus pegas: no cifra nada (así que no es sitio para contraseñas), tiene un límite de tamaño, y los datos solo viven en ese móvil concreto (si cambias de dispositivo, no se sincronizan).

En NoteFlow no lo uso a pelo, lo uso a través del middleware persist de Zustand. Eso hace que todo lo que cambia en el store se guarde automáticamente, sin tener que hacer guardar/leer a mano cada vez. Cuando abres la app, Zustand busca lo que había guardado con la clave "noteflow-storage" y lo mete en el store. A eso se le llama "rehidratación", porque básicamente le devuelves la vida a un estado que estaba dormido en disco.

La rehidratación tarda un poquito porque es asíncrona. Mientras pasa, el store está vacío. Si la app va rápida ni se nota, pero si tuvieras un montón de datos se vería un parpadeo cuando abres la app (primero ves todo vacío y luego aparece de golpe). Para evitarlo se puede comprobar si el store ya está rehidratado y, mientras no lo esté, mostrar una pantalla de carga (un spinner o un splash). Zustand tiene un método llamado onRehydrateStorage que te avisa cuando termina.

## Rendimiento en listas con FlashList

Una de las cosas que más fácil se rompe en una app móvil son las listas largas. En React Native viene FlatList por defecto, que vale para muchas cosas pero tiene un problema conocido: cuando la lista es grande y se hace scroll rápido, aparecen pantallas en blanco mientras el componente intenta renderizar lo que viene. Eso ocurre porque FlatList no recicla los componentes de forma muy eficiente.

FlashList, de Shopify, es básicamente una versión mejor de FlatList. Funciona igual de cara al uso (le pasas un array y una función para renderizar cada item), pero por dentro recicla los componentes de forma más agresiva. Cuando haces scroll, los componentes que salen de la pantalla se reutilizan para los que entran, en vez de crear unos nuevos cada vez. Eso ahorra mucho trabajo al hilo de JS y la lista va fluida.

En NoteFlow uso FlashList en las tres pantallas principales (Notas, Tareas e Ideas). Cada lista podría llegar a tener cincuenta o cien items, así que merece la pena usarlo desde el principio aunque al arrancar la app no haya casi nada.

## Validación de formularios con Zod

Zod es una librería para validar datos. La uso en el formulario de nueva-nota.tsx para que no se puedan guardar notas sin título o con campos vacíos.

Funciona así: defines un esquema con las reglas que tiene que cumplir cada campo (mínimo de caracteres, que no esté vacío, etc.) y luego le pasas los datos del formulario para que los compruebe. Si todo está bien, te lo deja pasar. Si algo falla, te devuelve los errores con el mensaje que tú habías puesto para cada regla. Yo los pinto debajo del campo correspondiente para que el usuario sepa qué tiene que arreglar.

Uso safeParse en vez de parse porque safeParse no lanza error si los datos están mal, simplemente te devuelve un objeto con success: false y los errores dentro. Así me ahorro andar con try/catch.

Lo del teclado lo arreglo con KeyboardAvoidingView. En iOS le paso behavior padding y en Android behavior height, que es lo que recomienda la documentación. Sin esto el teclado tapaba los inputs cuando escribías y era un coñazo.

## Feedback táctil con Haptics

Las vibraciones bien puestas hacen que la app se sienta mejor, como cuando tocas algo y el móvil responde. Para esto uso expo-haptics, la librería de Expo para hacer vibrar el móvil.

Tiene dos cosas principales que uso: impactAsync, que es como un golpecito corto y va bien para botones o para confirmar acciones tipo eliminar; y notificationAsync, que es una vibración con "intención" (éxito, error, etc.). En NoteFlow llamo a impactAsync cuando se elimina algo, y a notificationAsync con tipo Success cuando se marcan como completadas todas las tareas de una lista.

Las funciones son asíncronas pero no hace falta esperarlas porque la vibración es instantánea. Solo importa llamarlas en el momento adecuado.

## Extensiones de la fase

Como extras de la fase, he añadido tres mejoras opcionales que el bootcamp sugería.

La primera es una búsqueda global: cada pestaña tiene arriba un input que filtra los items en tiempo real según escribes. Para las notas filtra por título y contenido, para las tareas por título y para las ideas por título y etiquetas. La implementación es simple, un useState con el texto del input y un filter() sobre el array antes de pasarlo a FlashList.

La segunda son animaciones en las tarjetas con Reanimated. Cada tarjeta aparece con FadeInDown (entra desde abajo con un fade) y desaparece con FadeOutLeft (se va hacia la izquierda). Cada una con un delay pequeño según su índice, para que vayan apareciendo en cascada y la lista se sienta más viva. Reanimated tiene su propia configuración con Babel, así que toqué el babel.config.js para añadir su plugin.

La tercera es el sistema de archivar. Añadí un campo isArchived a las interfaces, acciones en el store para marcar como archivado, y una pestaña nueva "Archivadas" que muestra todo lo que está archivado. Las pantallas principales filtran para no mostrar los archivados, así que cuando archivas algo desaparece de su lista pero sigue accesible.