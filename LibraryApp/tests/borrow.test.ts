import { expect } from 'chai';
import { Library } from '../src/services/Library';
import { BorrowService } from '../src/services/BorrowService';
import { Book } from '../src/models/Book';
import { User } from '../src/models/User';

function setup(bookCount = 1) {
  const books = new Library<Book>();
  const users = new Library<User>();
  const user = new User('Артем', 'artem@example.com');
  users.add(user);
  for (let i = 0; i < bookCount; i += 1) {
    books.add(new Book(`Book ${i}`, 'Author', 2000 + i));
  }
  return { books, users, user, service: new BorrowService(books, users) };
}

describe('BorrowService', () => {
  it('позичає книгу: змінює стан книги та список книг користувача', () => {
    const { books, user, service } = setup();
    const book = books.getAll()[0] as Book;

    const result = service.borrow(book.getId(), user.getId());

    expect(result.success).to.be.true;
    expect(book.isBorrowed()).to.be.true;
    expect(book.getBorrowedBy()).to.equal(user.getId());
    expect(user.getBorrowedBookIds()).to.deep.equal([book.getId()]);
  });

  it('не дозволяє позичити четверту книгу (ліміт 3)', () => {
    const { books, user, service } = setup(4);
    const all = books.getAll();

    all.slice(0, 3).forEach((book) => service.borrow(book.getId(), user.getId()));
    const fourth = service.borrow((all[3] as Book).getId(), user.getId());

    expect(fourth).to.deep.equal({ success: false, reason: 'LIMIT_REACHED' });
    expect((all[3] as Book).isBorrowed()).to.be.false;
    expect(user.getBorrowedBookIds()).to.have.lengthOf(3);
  });

  it('не позичає вже позичену книгу', () => {
    const { books, user, service } = setup();
    const book = books.getAll()[0] as Book;
    service.borrow(book.getId(), user.getId());

    const again = service.borrow(book.getId(), user.getId());

    expect(again).to.deep.equal({ success: false, reason: 'ALREADY_BORROWED' });
  });

  it('повідомляє, якщо користувача не існує', () => {
    const { books, service } = setup();
    const book = books.getAll()[0] as Book;

    expect(service.borrow(book.getId(), '999')).to.deep.equal({
      success: false,
      reason: 'USER_NOT_FOUND',
    });
  });

  it('повертає книгу: знімає позначку та звільняє ліміт користувача', () => {
    const { books, user, service } = setup();
    const book = books.getAll()[0] as Book;
    service.borrow(book.getId(), user.getId());

    const returned = service.returnBook(book.getId());

    expect(returned).to.equal(book);
    expect(book.isBorrowed()).to.be.false;
    expect(user.getBorrowedBookIds()).to.have.lengthOf(0);
  });

  it('returnBook повертає undefined для не позиченої книги', () => {
    const { books, service } = setup();

    expect(service.returnBook((books.getAll()[0] as Book).getId())).to.be.undefined;
  });

  it('видалення позиченої книги звільняє ліміт користувача', () => {
    const { books, user, service } = setup();
    const book = books.getAll()[0] as Book;
    service.borrow(book.getId(), user.getId());

    service.removeBook(book.getId());

    expect(books.count()).to.equal(0);
    expect(user.getBorrowedBookIds()).to.have.lengthOf(0);
  });

  it('видалення користувача робить його книги знову доступними', () => {
    const { books, users, user, service } = setup();
    const book = books.getAll()[0] as Book;
    service.borrow(book.getId(), user.getId());

    service.removeUser(user.getId());

    expect(users.count()).to.equal(0);
    expect(book.isBorrowed()).to.be.false;
  });
});
