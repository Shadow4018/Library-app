import { expect } from 'chai';
import { paginate } from '../src/utils/pagination';
import { filterBooks } from '../src/utils/search';
import { generateId } from '../src/utils/idGenerator';
import { Book } from '../src/models/Book';

describe('paginate', () => {
  const items = Array.from({ length: 12 }, (_, i) => i + 1);

  it('повертає потрібну сторінку', () => {
    const page = paginate(items, 2, 5);

    expect(page.items).to.deep.equal([6, 7, 8, 9, 10]);
    expect(page.totalPages).to.equal(3);
    expect(page.totalItems).to.equal(12);
  });

  it('остання сторінка може бути неповною', () => {
    expect(paginate(items, 3, 5).items).to.deep.equal([11, 12]);
  });

  it('приводить некоректний номер сторінки до допустимого діапазону', () => {
    expect(paginate(items, 99, 5).page).to.equal(3);
    expect(paginate(items, 0, 5).page).to.equal(1);
  });

  it('для порожнього списку повертає одну порожню сторінку', () => {
    const page = paginate([], 1, 5);

    expect(page.items).to.have.lengthOf(0);
    expect(page.totalPages).to.equal(1);
  });
});

describe('filterBooks', () => {
  const books = [
    new Book('Clean Code', 'Robert Martin', 2008),
    new Book('Code Complete', 'Steve McConnell', 2004),
  ];

  it('шукає за назвою без урахування регістру', () => {
    expect(filterBooks(books, 'complete')).to.have.lengthOf(1);
  });

  it('шукає за автором', () => {
    expect(filterBooks(books, 'MARTIN')).to.have.lengthOf(1);
  });

  it('порожній запит повертає всі книги', () => {
    expect(filterBooks(books, '  ')).to.have.lengthOf(2);
  });
});

describe('generateId', () => {
  it('генерує унікальні id, що складаються лише з цифр', () => {
    const ids = new Set(Array.from({ length: 500 }, () => generateId()));

    expect(ids.size).to.equal(500);
    ids.forEach((id) => expect(id).to.match(/^[0-9]+$/));
  });
});
