//shortname test
async function shortname(org) {
  let shortname = null;

  if (org.url && org.url.en) {
    //get from org url
    const chunks = org.url.en.split('/');
    shortname = chunks[chunks.length - 1];
    shortname = shortname.substr(-32);
  } else {
    //get from org name
    shortname = org.name
      .toLowerCase()
      .replaceAll(' ', '_')
      .replace(/[^a-zA-Z_-]/g, '');
  }

  while (shortname.match(/_{2,}|-{2,}|_-|-_/g)) {
    shortname = shortname.replace(/_{2,}|-{2,}|_-|-_/g, '_');
  }

  while (!shortname[0].match(/[a-zA-Z0-9]/) && shortname.length > 0) {
    shortname = shortname.substring(1);
  }

  shortname = shortname.slice(0, 32) + Math.floor(1000 + Math.random() * 9000);

  return shortname;
}

console.log(
  await shortname({
    name: '___FIDI - Fundação Instituto - de Fundação Instituto - de InstitutoInstitutoPesquisa e Estudo de Diagnóstico por Imagem',
  }),
);