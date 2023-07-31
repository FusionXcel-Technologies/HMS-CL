export interface DisplayValue {
  id: number;
  name: string;
  value: string;
  selected: boolean;
}

class TrieNode {
  children: Map<string, TrieNode>;
  value: DisplayValue[];

  constructor() {
    this.children = new Map();
    this.value = [];
  }
}

export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  addToTrie(word: string, value: DisplayValue) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.value.push(value);
  }

  searchValue(searchQuery: string): DisplayValue[] {
    let node = this.root;
    for (const char of searchQuery.toLowerCase()) {
      if (node.children.has(char)) {
        node = node.children.get(char)!;
      } else {
        node = new TrieNode();
        break;
      }
    }

    return this.collectMatchingValues(node);
  }

  private collectMatchingValues(node: TrieNode): DisplayValue[] {
    const matchingValues: DisplayValue[] = [];
    matchingValues.push(...node.value);

    for (const childNode of node.children.values()) {
      matchingValues.push(...this.collectMatchingValues(childNode));
    }

    // Use a Set to keep track of unique elements
    const uniqueValuesSet = new Set<DisplayValue>();

    // Filter out duplicate elements and add them to the uniqueValuesSet
    matchingValues.forEach((value) => uniqueValuesSet.add(value));

    // Convert the Set back to an array
    const uniqueValuesArray: DisplayValue[] = Array.from(uniqueValuesSet);

    return uniqueValuesArray;
  }

}
