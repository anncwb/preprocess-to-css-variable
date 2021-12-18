import type { LibraryItem } from '../../../types';

export function resolveLibraryList(libraryList: LibraryItem[] = []) {
  const ret = libraryList
    .map((library) => {
      return resolveLibrary(library);
    })
    .filter(Boolean);
  return ret as string[];
}

export function resolveLibrary({ absolute, absolutePath, name }: LibraryItem) {
  if (absolute) {
    if (!absolutePath) {
      throw 'When `absolute = true`, absolutePath cannot be empty.';
    }
    return buildEntry(absolutePath, name);
  }
  try {
    const libEntry = require.resolve(name);
    return buildEntry(libEntry, name);
  } catch (error) {
    console.log(error);
    return null;
  }
}

function buildEntry(libEntry: string, libName: string) {
  const lastIndex = libEntry.lastIndexOf(libName) + libName.length;
  libEntry = libEntry.substring(0, lastIndex);
  return libEntry;
}
