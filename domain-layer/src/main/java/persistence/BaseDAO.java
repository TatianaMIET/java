package persistence;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Базовый класс для DAO сервисов.
 */
public class BaseDAO<T> {	
	
	/**
	 * Добавление новой записи.
	 * @param entity Описание новой записи.
	 */
	public void add(T entity) {
		entities.getTransaction().begin();
		entities.persist(entity);
		entities.getTransaction().commit();
	}	

	/**
	 * Вставка или обновление данных.
	 * @param entity Описание записи.
	 */
	public void merge(T entity) {

		entities.getTransaction().begin();
		entities.merge(entity);
		entities.getTransaction().commit();
	}	

	/**
	 * Удаление записи.
	 * @param entity Описание записи.
	 */
	public void remove(T entity) {
		entities.remove(entity);
	}		

	/**
	 * Применение изменений.
	 */
	public void flush() {
		entities.flush();
	}
	
	@Inject
	protected EntityManager entities;
}
