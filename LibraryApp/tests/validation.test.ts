import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation', () => {
  describe('validateBookForm', () => {
    it("повертає помилки для обов'язкових полів, якщо вони порожні", () => {
      const result = Validation.validateBookForm({ title: '', author: '', year: '' });

      expect(result.isValid).to.be.false;
      expect(result.errors.title).to.exist;
      expect(result.errors.author).to.exist;
      expect(result.errors.year).to.exist;
    });

    it('позначає рік невалідним, якщо він містить нецифрові символи', () => {
      const result = Validation.validateBookForm({
        title: 'Дюна',
        author: 'Френк Герберт',
        year: '19a6',
      });

      expect(result.isValid).to.be.false;
      expect(result.errors.year).to.exist;
    });

    it('проходить валідацію для коректних даних', () => {
      const result = Validation.validateBookForm({
        title: 'Дюна',
        author: 'Френк Герберт',
        year: '1965',
      });

      expect(result.isValid).to.be.true;
      expect(result.errors).to.deep.equal({});
    });
  });

  describe('validateUserForm', () => {
    it("вимагає обов'язкові поля name та email", () => {
      const result = Validation.validateUserForm({ name: '', email: '' });

      expect(result.isValid).to.be.false;
      expect(result.errors.name).to.exist;
      expect(result.errors.email).to.exist;
    });

    it('позначає некоректний email як помилку', () => {
      const result = Validation.validateUserForm({ name: 'Артем', email: 'not-an-email' });

      expect(result.isValid).to.be.false;
      expect(result.errors.email).to.exist;
    });

    it('проходить валідацію для коректних даних', () => {
      const result = Validation.validateUserForm({ name: 'Артем', email: 'artem@example.com' });

      expect(result.isValid).to.be.true;
    });
  });

  describe('isValidUserId', () => {
    it('приймає рядок лише з цифр', () => {
      expect(Validation.isValidUserId('12345')).to.be.true;
    });

    it('відхиляє рядок з буквами', () => {
      expect(Validation.isValidUserId('12a45')).to.be.false;
    });

    it('відхиляє порожній рядок', () => {
      expect(Validation.isValidUserId('')).to.be.false;
    });
  });

  describe('validateUserIdInput', () => {
    it('вимагає непорожнє значення', () => {
      const result = Validation.validateUserIdInput('  ');

      expect(result.isValid).to.be.false;
      expect(result.errors.userId).to.exist;
    });

    it('відхиляє id з нецифровими символами', () => {
      expect(Validation.validateUserIdInput('12ab').isValid).to.be.false;
    });

    it('приймає id з цифр', () => {
      expect(Validation.validateUserIdInput('1725533394038').isValid).to.be.true;
    });
  });

  describe('isValidYear', () => {
    it('приймає коректний рік у діапазоні', () => {
      expect(Validation.isValidYear('2008')).to.be.true;
    });

    it('відхиляє рік з нецифровими символами', () => {
      expect(Validation.isValidYear('20a8')).to.be.false;
    });

    it('відхиляє рік не з 4 цифр', () => {
      expect(Validation.isValidYear('999')).to.be.false;
      expect(Validation.isValidYear('20088')).to.be.false;
    });

    it('відхиляє рік у майбутньому', () => {
      expect(Validation.isValidYear(String(new Date().getFullYear() + 1))).to.be.false;
    });

    it('приймає поточний рік', () => {
      expect(Validation.isValidYear(String(new Date().getFullYear()))).to.be.true;
    });
  });
});
