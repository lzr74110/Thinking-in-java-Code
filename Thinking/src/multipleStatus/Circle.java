package multipleStatus;

public class Circle  extends Shape {

    @Override
    void erase() {
        System.err.println("this is circle erase");
    }

    @Override
    void draw() {
        System.err.println("this is circle draw");
    }
}
