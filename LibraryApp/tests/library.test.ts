import { expect } from 'chai';
import { Library } from '../src/services/Library';
import { Book } from '../src/models/Book';
import { User } from '../src/models/User';

describe('Library<T>', () => {
  it('додає елемент у колекцію', () => {
    const library = new Library<Book>();
    const book = new Book('Clean Code', 'Robert Martin', 2008);

    library.add(book);

    expect(library.count()).to.equal(1);
    expect(library.getAll()[0]).to.equal(book);
  });

  it('видаляє елемент за id та повертає true, якщо елемент існував', () => {
    const library = new Library<Book>();
    const book = new Book('Clean Code', 'Robert Martin', 2008);
    library.add(book);

    const removed = library.remove(book.getId());

    expect(removed).to.be.true;
    expect(library.count()).to.equal(0);
  });

  it('повертає false при видаленні неіснуючого id', () => {
    const library = new Library<Book>();

    expect(library.remove('unknown-id')).to.be.false;
  });

  it('знаходить елемент за id (findById)', () => {
    const library = new Library<Book>();
    const book = new Book('Code Complete', 'Steve McConnell', 2004);
    library.add(book);

    expect(library.findById(book.getId())).to.equal(book);
  });

  it('findById повертає undefined, якщо елемента немає', () => {
    const library = new Library<Book>();

    expect(library.findById('missing')).to.be.undefined;
  });

  it('шукає елементи за предикатом (find)', () => {
    const library = new Library<Book>();
    library.add(new Book('Clean Code', 'Robert Martin', 2008));
    library.add(new Book('Clean Architecture', 'Robert Martin', 2017));
    library.add(new Book('Code Complete', 'Steve McConnell', 2004));

    const result = library.find((book) => book.getAuthor() === 'Robert Martin');

    expect(result).to.have.lengthOf(2);
  });

  it('getAll() повертає копію масиву, а не посилання на внутрішній стан', () => {
    const library = new Library<Book>();
    library.add(new Book('Clean Code', 'Robert Martin', 2008));

    const items = library.getAll();
    items.push(new Book('Fake', 'Fake', 2000));

    expect(library.count()).to.equal(1);
  });

  it('clear() очищає колекцію', () => {
    const library = new Library<Book>([new Book('A', 'B', 2000)]);

    library.clear();

    expect(library.count()).to.equal(0);
  });

  it('працює з довільним типом T (наприклад, User), а не лише з Book', () => {
    const library = new Library<User>();
    const user = new User('Артем', 'artem@example.com');
    library.add(user);

    expect(library.findById(user.getId())).to.equal(user);
  });
});
