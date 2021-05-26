package model;


import codes.ResultCode.ResultCodes;
import org.apache.commons.lang3.StringUtils;

public class RequestResultModel {


    public RequestResultModel() {}

    public RequestResultModel(int resultCode, String resultText) {
        this.resultCode = resultCode;
        this.resultText = resultText;
    }

    public RequestResultModel(int resultCode) {
        this.resultCode = resultCode;
    }

    public RequestResultModel(String resultText) {
        this.resultText = resultText;
    }

    /**
     *  Код результата.
     */
    public int getResultCode() {
        return resultCode;
    }
    public void setResultCode(int resultCode) {
        this.resultCode = resultCode;
    }

    /**
     *  Текст результата.
     */
    public String getResultText() {
        return resultText;
    }
    public void setResultText(String resultText) {
        this.resultText = resultText;
    }


    public int resultCode = ResultCodes.SUCCESSFUL;
    public String resultText = StringUtils.EMPTY;

}
