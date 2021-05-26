package codes.ResultCode;

/**
 * Коды результатов.
 */
public final class ResultCodes {

    /**
     * Запрос успешен.
     */
    public static final int SUCCESSFUL = 0;

    /**
     * Общая ошибка.
     */
    public static final int GENERIC_ERROR = 1;

    /**
     * Данные не найдены.
     */
    public static final int RESULT_NOT_FOUND = 2;

    /**
     * Доступ запрешен.
     */
    public static final int RESULT_FORBIDDEN = 3;


    /**
     * Уже авторизован.
     */
    public static final int IS_REGISTERED = 4;


    /**
     * Неккоректно введено время выполнения задачи
     */
    public static final int INCORRECT_TIME = 5;

}
