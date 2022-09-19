//shortname test
async function shortname(org) {
  let shortname = null;

  if (org.url?.en) {
    //get from org url

    const url_string = new URL(org.url.en).pathname;

    console.log(url_string);

    const chunks = url_string.split('/');
    console.log(chunks);

    shortname = chunks[chunks.length - 1];
    shortname = decodeURI(shortname);
    shortname = shortname.slice(32);
  } else {
    //get from org name
    if (!org.name) return null;
    shortname = org.name.replaceAll(' ', '_').replace(/[^a-zA-Z_-]/g, '');
  }

  while (shortname.match(/_{2,}|-{2,}|_-|-_|\s/g)) {
    shortname = shortname.replace(/_{2,}|-{2,}|_-|-_|\s/g, '_');
  }

  while (!shortname[0].match(/[a-zA-Z0-9]/) && shortname.length > 0) {
    shortname = shortname.substring(1);
  }

  shortname =
    shortname.toLowerCase().slice(0, 32) +
    Math.floor(1000 + Math.random() * 9000);

  return shortname;
}

console.log(
  await shortname({
    url: {
      en: 'https://www.idealist.org/en/nonprofit/f73462b59165469c93774ad922c25586-defenders-of-wildlife-washington', //'http://idealist.com/en/nonprofit/12123213242132332121312___FIDI-Fundação-Instituto-de-Fundação==Instituto--de-InstitutoInstitutoPesquisa--e--Estudo-de-Diagnóstico-por-Imagem',
    },
    name: '__FIDI - Fundação Instituto - de Fundação Instituto - de/ InstitutoInstitutoPesquisa e Estudo de Diagnóstico por Imagem',
  }),
);
