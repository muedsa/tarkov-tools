export function handleTarkovDevImageLink(link: string) {
  if (link.startsWith("https://assets.tarkov.dev/")) {
    return link.replace("https://assets.tarkov.dev/", "/tarkov/images/");
  } else {
    return link;
  }
}
