package multipleStatus;

public class Line extends Shape {
    @Override
    void erase() {
        System.err.println("this is line erase");
    }

    @Override
    void draw() {
        System.err.println("this is line draw");
    }
}
